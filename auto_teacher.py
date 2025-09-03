"""
Auto Teacher (updated):
- Supports two backends for LLM calls: Ollama (default) and llama-cpp-python fallback
- Clear startup checks and helpful errors
- Graceful handling if Ollama not running / wrong endpoint
- Periodic persistence of FAISS index + docs_store to disk (INDEX_DIR)
- Slightly stronger user agent + jittered crawl delays
- Safer JSON extraction from model replies

ENV VARS (optional):
  TOPIC                default: "coding"
  MAX_PAGES_TOTAL      default: 200
  PAGES_PER_DOMAIN     default: 15
  CRAWL_DELAY_SEC      default: 1.5  (base value; jitter is added)

  EMBED_MODEL_NAME     default: all-MiniLM-L6-v2
  INDEX_DIR            default: ./index
  LLAMA_BACKEND        one of: "ollama" (default), "llama_cpp"
  OLLAMA_URL           default: http://localhost:11434
  OLLAMA_MODEL         default: llama2:7b
  LLAMA_CPP_MODEL_PATH path to gguf file if using llama_cpp

Run:
  TOPIC="coding" python auto_teacher_updated.py
"""

from __future__ import annotations
import os, time, re, json, queue, random, threading, signal, pickle, sys
from typing import List, Tuple, Optional
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup
import tldextract
import trafilatura
from simhash import Simhash
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np

# -------------------- Config --------------------
TOPIC: str             = os.environ.get("TOPIC", "coding")
MAX_PAGES_TOTAL: int   = int(os.environ.get("MAX_PAGES_TOTAL", "200"))
PAGES_PER_DOMAIN: int  = int(os.environ.get("PAGES_PER_DOMAIN", "15"))
CRAWL_DELAY_SEC: float = float(os.environ.get("CRAWL_DELAY_SEC", "1.5"))

EMBED_MODEL_NAME: str  = os.environ.get("EMBED_MODEL_NAME", "all-MiniLM-L6-v2")
INDEX_DIR: str         = os.environ.get("INDEX_DIR", "./index")
SEED_SITES: List[str]  = []  # leave empty to let Llama propose seeds

ALLOW_DOMAINS          = set()  # e.g., {"docs.python.org", "developer.mozilla.org"}
DENY_DOMAINS           = {"facebook.com","x.com","tiktok.com","instagram.com","reddit.com"}

# LLM backend config
LLAMA_BACKEND: str     = os.environ.get("LLAMA_BACKEND", "ollama").lower()  # "ollama" or "llama_cpp"
OLLAMA_URL: str        = os.environ.get("OLLAMA_URL", "http://localhost:11434").rstrip("/")
OLLAMA_MODEL: str      = os.environ.get("OLLAMA_MODEL", "llama2:7b")
LLAMA_CPP_MODEL_PATH: Optional[str] = os.environ.get("LLAMA_CPP_MODEL_PATH")

SAVE_EVERY_N_PAGES: int = 10

# -------------------- Globals --------------------
EMB = SentenceTransformer(EMBED_MODEL_NAME)
_emb_index = None  # faiss index
_emb_dim = EMB.get_sentence_embedding_dimension()
_docs_store: List[dict] = []  # list of {url, title, chunk_id, text}
_seen_hashes = set()
_domain_counts = {}
_stop = False

# llama.cpp handle (lazy)
_llama_cpp_handle = None

# -------------------- Utilities --------------------

def log(msg: str):
    print(time.strftime("[%H:%M:%S]"), msg, flush=True)


def json_array_from_text(txt: str) -> List:
    """Extract first top-level JSON array from text; return [] if fail."""
    try:
        m = re.search(r"\[.*?\]", txt, re.S)
        if not m:
            return []
        return json.loads(m.group(0))
    except Exception:
        return []


# -------------------- Backend: LLM --------------------

def _ensure_ollama_up() -> None:
    try:
        r = requests.get(f"{OLLAMA_URL}/api/tags", timeout=5)
        r.raise_for_status()
    except Exception as e:
        raise RuntimeError(
            f"Ollama is not reachable at {OLLAMA_URL}. Start it with 'ollama serve' or set LLAMA_BACKEND=llama_cpp. Original error: {e}"
        )


def _ollama_generate(prompt: str, system: str) -> str:
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": f"<<SYS>>{system}<</SYS>>\n{prompt}",
        "stream": False,
    }
    url = f"{OLLAMA_URL}/api/generate"
    r = requests.post(url, json=payload, timeout=120)
    # Provide clearer error if wrong endpoint/404
    if r.status_code == 404:
        raise RuntimeError(
            f"Ollama endpoint {url} returned 404. Is Ollama running and is the path '/api/generate' correct? Try 'curl {OLLAMA_URL}/api/tags'."
        )
    r.raise_for_status()
    data = r.json()
    return (data.get("response") or "").strip()


def _ensure_llama_cpp_loaded():
    global _llama_cpp_handle
    if _llama_cpp_handle is not None:
        return
    if not LLAMA_CPP_MODEL_PATH or not os.path.exists(LLAMA_CPP_MODEL_PATH):
        raise RuntimeError(
            "LLAMA_BACKEND is 'llama_cpp' but LLAMA_CPP_MODEL_PATH is not set or does not exist."
        )
    try:
        from llama_cpp import Llama  # type: ignore
    except Exception as e:
        raise RuntimeError(
            "llama-cpp-python is not installed. Run: pip install llama-cpp-python --upgrade"
        )
    _llama_cpp_handle = Llama(model_path=LLAMA_CPP_MODEL_PATH, n_ctx=4096, n_threads=os.cpu_count())


def _llama_cpp_generate(prompt: str, system: str) -> str:
    _ensure_llama_cpp_loaded()
    # emulate system prompt by prefixing
    full = f"<s>[SYSTEM]\n{system}\n[/SYSTEM]\n{prompt}"
    out = _llama_cpp_handle(
        full,
        max_tokens=512,
        temperature=0.2,
        top_p=0.95,
        echo=False
    )
    txt = out.get("choices", [{}])[0].get("text", "")
    return txt.strip()


def llama(prompt: str, system: str = "You are a helpful research planner.") -> str:
    if LLAMA_BACKEND == "ollama":
        _ensure_ollama_up()
        return _ollama_generate(prompt, system)
    elif LLAMA_BACKEND == "llama_cpp":
        return _llama_cpp_generate(prompt, system)
    else:
        raise RuntimeError(f"Unknown LLAMA_BACKEND: {LLAMA_BACKEND}")


# -------------------- Seeds --------------------

def propose_seeds(topic: str, n: int = 8) -> List[str]:
    prompt = f"""
Topic: {topic}
Return ONLY a JSON array of {n} high-authority websites (home pages) to learn this topic.
Prefer documentation, standards bodies, university pages, reputable blogs.
"""
    try:
        out = llama(prompt)
        arr = json_array_from_text(out)
        if arr:
            # keep only strings and normalize
            return [u.strip() for u in arr if isinstance(u, str) and u.strip()]
    except Exception as e:
        log(f"Seed generation via LLM failed, using fallback. Reason: {e}")

    # Fallback static seeds
    return [
        "https://developer.mozilla.org/",
        "https://docs.python.org/3/",
        "https://www.w3.org/",
        "https://en.cppreference.com/w/",
        "https://go.dev/doc/",
        "https://docs.oracle.com/javase/",
        "https://kotlinlang.org/docs/home.html",
        "https://docs.github.com/",
    ]


# -------------------- Robots / Fetch --------------------

def allowed_by_robots(url: str) -> bool:
    try:
        parts = urlparse(url)
        robots = f"{parts.scheme}://{parts.netloc}/robots.txt"
        txt = requests.get(robots, timeout=8).text.lower()
        # very naive; for production use 'urllib.robotparser'
        return "disallow: /" not in txt
    except Exception:
        return True


def fetch(url: str) -> Tuple[Optional[str], List[str]]:
    try:
        r = requests.get(
            url,
            timeout=20,
            headers={
                "User-Agent": "Mozilla/5.0 (compatible; AutoTeacher/1.0; +https://example.local/)",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            },
        )
        ct = r.headers.get("Content-Type", "")
        if r.status_code != 200 or ("text/html" not in ct and "application/xhtml+xml" not in ct):
            return None, []
        html = r.text
        soup = BeautifulSoup(html, "html.parser")
        links = [urljoin(url, a.get("href")) for a in soup.find_all("a", href=True)]
        text = trafilatura.extract(html, include_comments=False, include_tables=False) or ""
        return text, links
    except Exception:
        return None, []


# -------------------- Quality / Dedup --------------------

def is_good_text(text: str) -> bool:
    t = text.lower()
    if len(text) < 500:
        return False
    if ("cookie" in t and "consent" in t) or ("subscribe" in t and "newsletter" in t):
        return False
    return True


def is_near_duplicate(text: str, threshold: int = 10) -> bool:
    h = Simhash(text).value
    for s in _seen_hashes:
        if bin(h ^ s).count("1") <= threshold:
            return True
    _seen_hashes.add(h)
    return False


# -------------------- Indexing / Persistence --------------------

def ensure_index():
    global _emb_index
    if _emb_index is None:
        _emb_index = faiss.IndexFlatIP(_emb_dim)


def chunk(text: str, max_chars: int = 2000, overlap: int = 200) -> List[str]:
    parts: List[str] = []
    i = 0
    while i < len(text):
        parts.append(text[i : i + max_chars])
        i += max_chars - overlap
    return parts


def upsert(text: str, url: str, title: Optional[str] = None) -> None:
    ensure_index()
    chunks = chunk(text)
    if not chunks:
        return
    vectors = EMB.encode(chunks, normalize_embeddings=True)
    _emb_index.add(np.array(vectors, dtype="float32"))
    start = len(_docs_store)
    for i, ch in enumerate(chunks):
        _docs_store.append({"url": url, "title": title or "", "chunk_id": start + i, "text": ch})


def save_state() -> None:
    os.makedirs(INDEX_DIR, exist_ok=True)
    # Save docs
    with open(os.path.join(INDEX_DIR, "docs.pkl"), "wb") as f:
        pickle.dump(_docs_store, f)
    # Save FAISS
    if _emb_index is not None:
        faiss.write_index(_emb_index, os.path.join(INDEX_DIR, "faiss.index"))
    # Save seen hashes and domain counts
    with open(os.path.join(INDEX_DIR, "meta.pkl"), "wb") as f:
        pickle.dump({"seen": list(_seen_hashes), "domain_counts": _domain_counts}, f)
    log("State saved.")


def load_state() -> None:
    global _emb_index, _docs_store, _seen_hashes, _domain_counts
    try:
        with open(os.path.join(INDEX_DIR, "docs.pkl"), "rb") as f:
            _docs_store = pickle.load(f)
        meta_path = os.path.join(INDEX_DIR, "meta.pkl")
        if os.path.exists(meta_path):
            with open(meta_path, "rb") as f:
                meta = pickle.load(f)
            _seen_hashes = set(meta.get("seen", []))
            _domain_counts.update(meta.get("domain_counts", {}))
        idx_path = os.path.join(INDEX_DIR, "faiss.index")
        if os.path.exists(idx_path):
            _emb_index = faiss.read_index(idx_path)
        else:
            ensure_index()
        log(f"Loaded state: {len(_docs_store)} chunks.")
    except Exception:
        ensure_index()
        log("No previous state found. Starting fresh.")


# -------------------- Link Scoring --------------------

def score_links_with_llama(topic: str, parent_url: str, links: List[str]) -> List[str]:
    if not links:
        return []
    # Deduplicate and keep same-origin a bit more
    uniq = []
    seen = set()
    for u in links:
        if not isinstance(u, str):
            continue
        u = u.strip()
        if not u or u in seen:
            continue
        seen.add(u)
        uniq.append(u)
    subset = uniq[:12] if len(uniq) > 12 else uniq

    prompt = f"""
You are selecting the most promising NEXT URLs to learn topic: "{topic}" from parent page: {parent_url}
Pick up to 5 that are:
1) High-signal (official docs, standards, tutorials, academic),
2) Likely to add NEW knowledge vs duplicates,
3) Not forums/social feeds.

Return ONLY a JSON array of the chosen URLs.
Candidates:\n{json.dumps(subset, indent=2)}
"""
    try:
        out = llama(prompt, system="You are a careful research assistant.")
        arr = json_array_from_text(out)
        return [u for u in arr if isinstance(u, str)]
    except Exception:
        return []


# -------------------- Crawl Loop --------------------

def crawl_topic(topic: str) -> None:
    global _domain_counts
    load_state()

    seeds = SEED_SITES or propose_seeds(topic)
    log(f"Seeds: {seeds}")

    q: queue.Queue[str] = queue.Queue()
    visited = set()

    for s in seeds:
        q.put(s)

    pages = 0
    last_saved_at = 0

    while not q.empty() and pages < MAX_PAGES_TOTAL and not _stop:
        url = q.get()
        if url in visited:
            continue
        visited.add(url)

        domain = tldextract.extract(url).registered_domain
        if domain in DENY_DOMAINS:
            continue
        if ALLOW_DOMAINS and domain not in ALLOW_DOMAINS:
            continue
        if _domain_counts.get(domain, 0) >= PAGES_PER_DOMAIN:
            continue
        if not allowed_by_robots(url):
            continue

        text, links = fetch(url)
        # Polite delay with jitter
        jitter = random.uniform(0.5, 1.2)
        time.sleep(CRAWL_DELAY_SEC * jitter)

        if not text or not is_good_text(text) or is_near_duplicate(text):
            continue

        upsert(text, url)
        _domain_counts[domain] = _domain_counts.get(domain, 0) + 1
        pages += 1

        if pages - last_saved_at >= SAVE_EVERY_N_PAGES:
            save_state()
            last_saved_at = pages

        # Teacher agent picks next links
        scored = score_links_with_llama(topic, url, links)
        for u in scored:
            q.put(u)

    save_state()
    log(f"[DONE] Indexed chunks: {len(_docs_store)} from ~{pages} pages.")


# -------------------- RAG --------------------

def rag_query(question: str, k: int = 5) -> str:
    ensure_index()
    if _emb_index is None or _emb_index.ntotal == 0:
        return "Knowledge base is empty. Crawl first."
    q_emb = EMB.encode([question], normalize_embeddings=True).astype("float32")
    D, I = _emb_index.search(q_emb, k)
    ctx_list = []
    for idx in I[0]:
        if 0 <= idx < len(_docs_store):
            ctx_list.append(_docs_store[idx]["text"])
    ctx = "\n\n".join(ctx_list)
    answer = llama(
        f"Use the CONTEXT to answer concisely and cite URLs inline like [1] when obvious.\n\nCONTEXT:\n{ctx}\n\nQUESTION: {question}\n\nAnswer:",
        system="Answer concisely and only from the provided context when possible.",
    )
    return answer


# -------------------- CLI --------------------

def _signal_handler(sig, frame):
    global _stop
    log("Stopping... saving state.")
    _stop = True
    save_state()
    sys.exit(0)


def main():
    signal.signal(signal.SIGINT, _signal_handler)
    signal.signal(signal.SIGTERM, _signal_handler)

    log(f"Starting autonomous crawl for topic: {TOPIC}")
    try:
        crawl_topic(TOPIC)
    except RuntimeError as e:
        # Friendly message if backend not up
        log(f"Fatal: {e}")
        return

    while True:
        try:
            q = input("\nAsk a question (or :quit): ").strip()
        except EOFError:
            break
        if q == ":quit":
            break
        print(rag_query(q))


if __name__ == "__main__":
    main()
