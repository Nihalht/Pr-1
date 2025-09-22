import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  ArrowRight,
  Download,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Github,
  Calendar,
  GraduationCap,
  Briefcase,
  Award,
  Code,
  Database,
  Brain,
  Blocks,
} from "lucide-react"

export default function HomePage() {
  const skills = {
    "Programming Languages": ["Python", "C", "SQL", "Solidity"],
    "Data Management": ["MySQL", "PostgreSQL", "MongoDB", "NoSQL"],
    "AI & Machine Learning": ["TensorFlow", "PyTorch", "scikit-learn", "Keras", "OpenCV", "NLP"],
    "Web Development": ["Django", "FastAPI", "RESTful APIs"],
    "Tools & Platforms": ["Git/GitHub", "Jupyter", "Streamlit"],
    Blockchain: ["Smart Contracts", "Web3.js", "Ethereum"],
  }

  const projects = [
    {
      title: "AI & Blockchain-Based Student Performance Data Analysis",
      year: "2025",
      description:
        "Developed an analytics platform combining machine learning with blockchain security, achieving 92% accuracy in performance forecasting. Built a secure data pipeline with smart contracts for tamper-proof records.",
      accuracy: "92%",
      icon: <Brain className="h-6 w-6" />,
    },
    {
      title: "Crop & Fertilizer Prediction Using AI & ML",
      year: "2024",
      description:
        "Created an agricultural system with 89% accuracy using Random Forest and XGBoost. Integrated weather API and soil data via Flask backend, tailoring predictions to specific crop requirements.",
      accuracy: "89%",
      icon: <Database className="h-6 w-6" />,
    },
    {
      title: "Healthcare AI Diagnostic Assistant",
      year: "2024",
      description:
        "Developed a CNN-based model with 94% accuracy for medical image analysis using OpenCV. Created FastAPI RESTful API integrated with hospital systems; implemented secure authentication and HIPAA-compliant data handling.",
      accuracy: "94%",
      icon: <Code className="h-6 w-6" />,
    },
  ]

  const experience = [
    {
      company: "TechCiti Private Limited",
      location: "Bengaluru, India",
      role: "Software Development (AI/ML) Intern",
      year: "2024",
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      company: "10 SECONDS, Remote (NICC)",
      location: "Remote",
      role: "Cyber Security Intern",
      year: "2022",
      icon: <Briefcase className="h-5 w-5" />,
    },
  ]

  const education = [
    {
      institution: "Navkis College of Engineering, Hassan",
      degree: "Bachelor of Engineering in Artificial Intelligence & Data Science",
      period: "2021 – 2025",
      grade: "CGPA: 7.75",
      university: "VTU",
    },
    {
      institution: "Mahesh PU College, Hassan",
      degree: "12th Grade",
      period: "2021",
      grade: "72%",
    },
    {
      institution: "SVM English High School, Hassan",
      degree: "10th Grade",
      period: "2019",
      grade: "80%",
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-background to-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-balance">
                  Hi, I'm <span className="text-primary">Nihal HT</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground text-pretty">
                  AI/ML Engineer & Full Stack Developer
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                  Driven by a track record in developing AI-driven solutions, I specialize in AI/ML Engineering, Full
                  Stack Development, and Data Science. I deliver practical innovations through secure, efficient code
                  with hands-on experience building predictive models achieving up to 94% accuracy.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="group">
                  <Link href="/contact">
                    Get In Touch
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="group bg-transparent">
                  <Download className="mr-2 h-4 w-4" />
                  Download Resume
                </Button>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>+91 8951107072</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>nihalnihal8951@gmail.com</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>Hassan, India</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <div className="w-80 h-80 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                  <div className="w-72 h-72 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-6xl font-bold">
                    NH
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                  <Brain className="h-8 w-8 text-secondary-foreground" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <Code className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Technical Skills</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Expertise across multiple domains of technology and development
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(skills).map(([category, skillList]) => (
              <Card key={category} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {category === "Programming Languages" && <Code className="h-5 w-5 text-primary" />}
                    {category === "Data Management" && <Database className="h-5 w-5 text-primary" />}
                    {category === "AI & Machine Learning" && <Brain className="h-5 w-5 text-primary" />}
                    {category === "Web Development" && <ExternalLink className="h-5 w-5 text-primary" />}
                    {category === "Tools & Platforms" && <Award className="h-5 w-5 text-primary" />}
                    {category === "Blockchain" && <Blocks className="h-5 w-5 text-primary" />}
                    {category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skillList.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Innovative solutions combining AI, blockchain, and full-stack development
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {project.icon}
                      <Badge variant="outline">{project.year}</Badge>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20">{project.accuracy} Accuracy</Badge>
                  </div>
                  <CardTitle className="text-balance">{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-pretty leading-relaxed">{project.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experience & Education Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Experience */}
            <div>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <Briefcase className="h-8 w-8 text-primary" />
                Experience
              </h2>
              <div className="space-y-6">
                {experience.map((exp, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{exp.role}</CardTitle>
                          <CardDescription className="font-medium">{exp.company}</CardDescription>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {exp.location}
                          </div>
                        </div>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {exp.year}
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>

            {/* Education */}
            <div>
              <h2 className="text-3xl font-bold mb-8 flex items-center gap-2">
                <GraduationCap className="h-8 w-8 text-primary" />
                Education
              </h2>
              <div className="space-y-6">
                {education.map((edu, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="space-y-2">
                        <CardTitle className="text-lg text-balance">{edu.degree}</CardTitle>
                        <CardDescription className="font-medium">{edu.institution}</CardDescription>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {edu.period}
                          </Badge>
                          <Badge className="bg-secondary/10 text-secondary border-secondary/20">{edu.grade}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications & Achievements */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Certifications & Achievements</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Certifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Full Stack Web Development</span>
                  <Badge variant="outline">Udemy (2023)</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Cyber Security Fundamentals</span>
                  <Badge variant="outline">NICC (2023)</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Python for Data Science</span>
                  <Badge variant="outline">DataCamp (2023)</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-secondary" />
                  Key Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-pretty">
                  Educated local farmers on maximizing crop yields by advising on fertilizer types, quantities, and
                  usage tailored to their specific crops, fostering sustainable and efficient agricultural practices.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's Work Together</h2>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">
            Ready to bring your AI/ML projects to life? Let's discuss how we can collaborate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="group">
              <Link href="/contact">
                Start a Conversation
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="https://github.com/Nihalht" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                View My Work
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
