import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Clock,
  Users,
  Star,
  Calendar,
  Award,
  ChevronDown,
  Play,
  FileText,
  CheckCircle,
  ArrowRight,
  Share2,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Mock course data - will be replaced with Supabase query
const courseData = {
  id: "1",
  title: "Digital Health Innovation Leadership",
  slug: "digital-health-innovation",
  shortDescription: "Lead healthcare transformation with cutting-edge digital solutions and innovation strategies.",
  description: `This comprehensive program equips healthcare leaders with the skills to drive digital transformation in their organizations. You'll learn to evaluate emerging technologies, build business cases for innovation, and lead cross-functional teams through complex change initiatives.

Through real-world case studies and hands-on projects, you'll develop practical strategies for implementing AI, telemedicine, wearables, and other digital health solutions while navigating regulatory requirements and ensuring patient safety.`,
  thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&h=600&fit=crop",
  type: "cohort",
  price: 499,
  duration: "8 weeks",
  effortHours: "5-7 hours/week",
  level: "Intermediate",
  category: "Digital Health",
  rating: 4.9,
  studentsEnrolled: 2450,
  startDate: "February 15, 2026",
  learningOutcomes: [
    "Evaluate and select appropriate digital health technologies for your organization",
    "Build compelling business cases for digital health initiatives",
    "Lead cross-functional teams through digital transformation",
    "Navigate regulatory and compliance requirements",
    "Design patient-centered digital health solutions",
    "Measure and communicate ROI of digital health investments",
  ],
  prerequisites: [
    "3+ years experience in healthcare or related field",
    "Basic understanding of healthcare systems",
    "Comfortable with technology concepts",
  ],
  targetAudience: [
    "Healthcare administrators and executives",
    "Clinical leaders exploring digital transformation",
    "Health IT professionals seeking leadership skills",
    "Entrepreneurs in digital health space",
  ],
  modules: [
    {
      title: "Foundations of Digital Health",
      lessons: [
        { title: "The Digital Health Landscape", duration: "45 min", type: "video" },
        { title: "Key Technologies Shaping Healthcare", duration: "60 min", type: "video" },
        { title: "Case Study: Successful Digital Transformations", duration: "30 min", type: "reading" },
        { title: "Module 1 Assessment", duration: "20 min", type: "quiz" },
      ],
    },
    {
      title: "Evaluating Digital Health Solutions",
      lessons: [
        { title: "Technology Assessment Frameworks", duration: "50 min", type: "video" },
        { title: "Vendor Evaluation Best Practices", duration: "40 min", type: "video" },
        { title: "Pilot Program Design", duration: "35 min", type: "reading" },
        { title: "Hands-on: Building an Evaluation Matrix", duration: "60 min", type: "project" },
      ],
    },
    {
      title: "Building the Business Case",
      lessons: [
        { title: "ROI Analysis for Digital Health", duration: "55 min", type: "video" },
        { title: "Stakeholder Mapping and Engagement", duration: "45 min", type: "video" },
        { title: "Presenting to the C-Suite", duration: "40 min", type: "video" },
        { title: "Project: Create Your Business Case", duration: "90 min", type: "project" },
      ],
    },
    {
      title: "Leading Digital Transformation",
      lessons: [
        { title: "Change Management in Healthcare", duration: "50 min", type: "video" },
        { title: "Building High-Performance Teams", duration: "45 min", type: "video" },
        { title: "Overcoming Resistance to Change", duration: "35 min", type: "reading" },
        { title: "Live Session: Leadership Q&A", duration: "60 min", type: "live" },
      ],
    },
    {
      title: "Regulatory and Compliance Considerations",
      lessons: [
        { title: "HIPAA and Digital Health", duration: "60 min", type: "video" },
        { title: "FDA Regulations for Digital Health", duration: "55 min", type: "video" },
        { title: "International Compliance Frameworks", duration: "40 min", type: "reading" },
        { title: "Module 5 Assessment", duration: "25 min", type: "quiz" },
      ],
    },
    {
      title: "Capstone Project",
      lessons: [
        { title: "Capstone Overview and Requirements", duration: "30 min", type: "reading" },
        { title: "Mentor Office Hours", duration: "60 min", type: "live" },
        { title: "Final Presentation and Peer Review", duration: "90 min", type: "project" },
      ],
    },
  ],
  facilitators: [
    {
      name: "Dr. Jennifer Martinez",
      title: "Chief Digital Officer",
      bio: "Former CDO at Mayo Clinic with 15+ years leading digital transformation in healthcare systems.",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop",
      expertise: ["Digital Strategy", "Change Management", "Health IT"],
    },
    {
      name: "Dr. Michael Chen",
      title: "Professor of Health Informatics",
      bio: "Stanford faculty member and researcher focusing on AI applications in clinical settings.",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop",
      expertise: ["AI/ML in Healthcare", "Clinical Informatics", "Research"],
    },
  ],
  faqs: [
    {
      question: "What is the time commitment for this course?",
      answer: "Plan for 5-7 hours per week including video lessons, readings, and project work. Live sessions are scheduled on Thursdays at 6 PM EST.",
    },
    {
      question: "Is there a certificate upon completion?",
      answer: "Yes! Upon successful completion of all modules and the capstone project, you'll receive a verified digital certificate from Cytobiz Academy that you can share on LinkedIn.",
    },
    {
      question: "Can I access course materials after completion?",
      answer: "Absolutely. You'll have lifetime access to all course materials, including future updates to the curriculum.",
    },
    {
      question: "What if I fall behind the cohort schedule?",
      answer: "We understand life happens. You can complete at your own pace, but we encourage staying with the cohort for live sessions and peer collaboration. Our team will work with you if you need accommodations.",
    },
    {
      question: "Is there a refund policy?",
      answer: "Yes, we offer a full refund within 14 days of enrollment if you're not satisfied with the program.",
    },
  ],
};

export default function CourseDetail() {
  const { slug } = useParams();
  const [isSaved, setIsSaved] = useState(false);

  // In production, fetch course by slug from Supabase
  const course = courseData;

  const getLessonIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="w-4 h-4" />;
      case "reading":
        return <FileText className="w-4 h-4" />;
      case "quiz":
        return <CheckCircle className="w-4 h-4" />;
      case "project":
        return <Award className="w-4 h-4" />;
      case "live":
        return <Users className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-hero-gradient overflow-hidden">
        <div className="container-wide relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-primary-foreground"
            >
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-white/20 text-primary-foreground border-0">
                  {course.category}
                </Badge>
                <Badge className="bg-accent text-accent-foreground border-0 capitalize">
                  {course.type}
                </Badge>
                <Badge variant="outline" className="border-white/30 text-primary-foreground">
                  {course.level}
                </Badge>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {course.title}
              </h1>

              <p className="text-lg text-primary-foreground/80 mb-6">
                {course.shortDescription}
              </p>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-6 mb-8 text-primary-foreground/80">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  {course.duration}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {course.studentsEnrolled.toLocaleString()} enrolled
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  {course.rating} rating
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Starts {course.startDate}
                </div>
              </div>

              {/* Facilitators Preview */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {course.facilitators.map((f) => (
                    <img
                      key={f.name}
                      src={f.image}
                      alt={f.name}
                      className="w-12 h-12 rounded-full border-2 border-white object-cover"
                    />
                  ))}
                </div>
                <div>
                  <p className="font-medium">
                    {course.facilitators.map((f) => f.name).join(" & ")}
                  </p>
                  <p className="text-sm text-primary-foreground/70">Course Facilitators</p>
                </div>
              </div>
            </motion.div>

            {/* Enrollment Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:sticky lg:top-24"
            >
              <div className="bg-card rounded-2xl shadow-xl overflow-hidden border border-border">
                <div className="relative h-48">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                  <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/90 flex items-center justify-center hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 text-primary ml-1" />
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-4xl font-bold text-card-foreground">
                      ${course.price}
                    </span>
                    <span className="text-muted-foreground">one-time payment</span>
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-primary hover:bg-primary/90 mb-3 h-14 text-lg"
                    asChild
                  >
                    <Link to="/signup">
                      Enroll Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsSaved(!isSaved)}
                    >
                      <Heart
                        className={`w-4 h-4 mr-2 ${
                          isSaved ? "fill-red-500 text-red-500" : ""
                        }`}
                      />
                      Save
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>

                  <div className="mt-6 space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      {course.effortHours} weekly
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Certificate of completion
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Lifetime access to materials
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      30-day money-back guarantee
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 py-16">
        <div className="container-wide">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-16">
              {/* About */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  About This Course
                </h2>
                <div className="prose prose-lg text-muted-foreground max-w-none">
                  {course.description.split("\n\n").map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>

              {/* Learning Outcomes */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  What You'll Learn
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {course.learningOutcomes.map((outcome, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-3 p-4 rounded-xl bg-muted/50"
                    >
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-foreground">{outcome}</span>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Curriculum */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Curriculum
                </h2>
                <Accordion type="multiple" className="space-y-4">
                  {course.modules.map((module, moduleIndex) => (
                    <AccordionItem
                      key={moduleIndex}
                      value={`module-${moduleIndex}`}
                      className="border border-border rounded-xl overflow-hidden bg-card"
                    >
                      <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                        <div className="flex items-center gap-4 text-left">
                          <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                            {moduleIndex + 1}
                          </span>
                          <div>
                            <h3 className="font-semibold text-card-foreground">
                              {module.title}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {module.lessons.length} lessons
                            </p>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-4">
                        <div className="space-y-2 pt-2">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lessonIndex}
                              className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                                  {getLessonIcon(lesson.type)}
                                </div>
                                <span className="text-foreground">{lesson.title}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {lesson.duration}
                              </span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>

              {/* Facilitators */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Meet Your Facilitators
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {course.facilitators.map((facilitator) => (
                    <div
                      key={facilitator.name}
                      className="p-6 rounded-2xl border border-border bg-card"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={facilitator.image}
                          alt={facilitator.name}
                          className="w-20 h-20 rounded-xl object-cover"
                        />
                        <div>
                          <h3 className="font-semibold text-card-foreground">
                            {facilitator.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{facilitator.title}</p>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-4">{facilitator.bio}</p>
                      <div className="flex flex-wrap gap-2">
                        {facilitator.expertise.map((exp) => (
                          <Badge key={exp} variant="secondary">
                            {exp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* FAQs */}
              <section>
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Frequently Asked Questions
                </h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {course.faqs.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`faq-${index}`}
                      className="border border-border rounded-xl overflow-hidden bg-card px-6"
                    >
                      <AccordionTrigger className="py-4 hover:no-underline text-left font-medium">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="pb-4 text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Prerequisites */}
              <div className="p-6 rounded-2xl border border-border bg-card">
                <h3 className="font-semibold text-card-foreground mb-4">Prerequisites</h3>
                <ul className="space-y-3">
                  {course.prerequisites.map((prereq, index) => (
                    <li key={index} className="flex gap-3 text-sm text-muted-foreground">
                      <ChevronDown className="w-4 h-4 rotate-[-90deg] text-primary flex-shrink-0 mt-0.5" />
                      {prereq}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Target Audience */}
              <div className="p-6 rounded-2xl border border-border bg-card">
                <h3 className="font-semibold text-card-foreground mb-4">Who This Is For</h3>
                <ul className="space-y-3">
                  {course.targetAudience.map((audience, index) => (
                    <li key={index} className="flex gap-3 text-sm text-muted-foreground">
                      <Users className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      {audience}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
