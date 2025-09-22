import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import {
  Calendar,
  Clock,
  ArrowRight,
  Search,
  Brain,
  Code,
  Database,
  Blocks,
  TrendingUp,
  BookOpen,
  Filter,
} from "lucide-react"

export default function BlogsPage() {
  const blogPosts = [
    {
      id: 1,
      title: "Building Scalable AI Models with TensorFlow and PyTorch",
      excerpt:
        "A comprehensive guide to developing and deploying machine learning models that can handle production-level workloads. Learn best practices for model architecture, training optimization, and deployment strategies.",
      category: "AI/ML",
      readTime: "8 min read",
      publishDate: "2024-12-15",
      tags: ["TensorFlow", "PyTorch", "Machine Learning", "Scalability"],
      featured: true,
      icon: <Brain className="h-5 w-5" />,
    },
    {
      id: 2,
      title: "Blockchain Integration in Modern Web Applications",
      excerpt:
        "Exploring how to integrate blockchain technology into web applications using Web3.js and smart contracts. From wallet connections to transaction handling, this guide covers it all.",
      category: "Blockchain",
      readTime: "12 min read",
      publishDate: "2024-12-10",
      tags: ["Blockchain", "Web3.js", "Smart Contracts", "Ethereum"],
      featured: true,
      icon: <Blocks className="h-5 w-5" />,
    },
    {
      id: 3,
      title: "Full-Stack Development with Django and React",
      excerpt:
        "Learn how to build robust full-stack applications using Django for the backend and React for the frontend. Includes authentication, API design, and deployment strategies.",
      category: "Web Development",
      readTime: "15 min read",
      publishDate: "2024-12-05",
      tags: ["Django", "React", "Full-Stack", "API Development"],
      featured: false,
      icon: <Code className="h-5 w-5" />,
    },
    {
      id: 4,
      title: "Data Pipeline Optimization for ML Workflows",
      excerpt:
        "Optimizing data pipelines for machine learning workflows using modern tools and techniques. Learn about data preprocessing, feature engineering, and automated ML pipelines.",
      category: "Data Science",
      readTime: "10 min read",
      publishDate: "2024-11-28",
      tags: ["Data Science", "ML Pipelines", "Feature Engineering", "Automation"],
      featured: false,
      icon: <Database className="h-5 w-5" />,
    },
    {
      id: 5,
      title: "Computer Vision Applications in Healthcare",
      excerpt:
        "Exploring the applications of computer vision in healthcare, from medical image analysis to diagnostic assistance. Learn about CNN architectures and real-world implementations.",
      category: "AI/ML",
      readTime: "11 min read",
      publishDate: "2024-11-20",
      tags: ["Computer Vision", "Healthcare", "CNN", "Medical Imaging"],
      featured: false,
      icon: <Brain className="h-5 w-5" />,
    },
    {
      id: 6,
      title: "RESTful API Design Best Practices",
      excerpt:
        "A comprehensive guide to designing and implementing RESTful APIs that are scalable, maintainable, and developer-friendly. Includes authentication, versioning, and documentation strategies.",
      category: "Web Development",
      readTime: "9 min read",
      publishDate: "2024-11-15",
      tags: ["REST API", "Backend Development", "API Design", "FastAPI"],
      featured: false,
      icon: <Code className="h-5 w-5" />,
    },
  ]

  const categories = ["All", "AI/ML", "Web Development", "Blockchain", "Data Science"]
  const featuredPosts = blogPosts.filter((post) => post.featured)
  const recentPosts = blogPosts.filter((post) => !post.featured)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tech Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Insights, tutorials, and thoughts on AI/ML, web development, blockchain, and emerging technologies. Stay
            updated with the latest trends and best practices.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search articles..." className="pl-10" />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={category === "All" ? "default" : "outline"}
                    size="sm"
                    className="text-sm"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Posts */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Featured Articles</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-primary/10 text-primary border-primary/20">{post.category}</Badge>
                    <Badge variant="outline" className="text-xs">
                      Featured
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors text-balance">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-pretty leading-relaxed">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(post.publishDate)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {post.readTime}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="ghost" className="group/btn p-0 h-auto font-medium">
                    Read More
                    <ArrowRight className="ml-1 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Recent Posts */}
        <section>
          <div className="flex items-center gap-2 mb-8">
            <BookOpen className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Recent Articles</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="text-primary">{post.icon}</div>
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors text-balance">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="text-pretty leading-relaxed line-clamp-3">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(post.publishDate)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="ghost" className="group/btn p-0 h-auto font-medium">
                    Read More
                    <ArrowRight className="ml-1 h-3 w-3 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="mt-20">
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Stay Updated</CardTitle>
              <CardDescription className="text-pretty">
                Subscribe to get notified about new articles on AI/ML, web development, and emerging technologies.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input placeholder="Enter your email" type="email" className="flex-1" />
                <Button className="sm:w-auto">Subscribe</Button>
              </div>
              <p className="text-xs text-muted-foreground text-center mt-4">
                No spam, unsubscribe at any time. I respect your privacy.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Topics */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-8 text-center">Popular Topics</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Machine Learning",
              "Deep Learning",
              "Computer Vision",
              "Natural Language Processing",
              "React",
              "Django",
              "FastAPI",
              "Blockchain",
              "Smart Contracts",
              "Data Science",
              "Python",
              "TensorFlow",
              "PyTorch",
              "Web3",
              "API Development",
            ].map((topic) => (
              <Badge
                key={topic}
                variant="outline"
                className="hover:bg-primary hover:text-primary-foreground cursor-pointer transition-colors"
              >
                {topic}
              </Badge>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Have a Topic Suggestion?</h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">
            I'm always looking for new topics to write about. If you have suggestions or questions, feel free to reach
            out.
          </p>
          <Button asChild size="lg" className="group">
            <Link href="/contact">
              Suggest a Topic
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </section>
      </div>
    </div>
  )
}
