import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  HelpCircle, 
  BookOpen, 
  CreditCard, 
  Award,
  Users,
  Clock,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Search,
  X,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SEOHead } from "@/components/SEOHead";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqCategories = [
  {
    id: "general",
    title: "About the Academy",
    icon: HelpCircle,
    color: "from-primary to-accent",
    questions: [
      {
        question: "What is Cytobiz Medical & Innovation Academy?",
        answer: "Cytobiz Medical & Innovation Academy is a specialized learning hub focused on medical & health education, public health, healthcare innovation, and digital health, delivering practical, outcome-driven training for students and professionals."
      },
      {
        question: "Who can enroll in your courses?",
        answer: "Our programs are open to: Medical/Health students, Healthcare professionals, Public health practitioners, Researchers, Innovators and early-career professionals, and individuals seeking to transition into medical, healthcare, or public health–related careers. Some courses may have specific eligibility requirements, which will be stated clearly on the course page."
      },
      {
        question: "Are your courses online?",
        answer: "Yes. All our courses are delivered fully online, with practical, hands-on learning components integrated into the sessions."
      },
    ],
  },
  {
    id: "courses",
    title: "Courses & Learning",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
    questions: [
      {
        question: "What types of courses do you offer?",
        answer: "We offer two main types of courses: Cohort-Based Courses – live, scheduled programs with facilitators, peer learning, capstone projects, and graduation. Self-Paced Courses – on-demand courses with recorded content and flexible learning schedules."
      },
      {
        question: "What is a Capstone Project?",
        answer: "A Capstone Project is a practical, applied project required in most cohort-based programs. It allows learners to apply their knowledge to real healthcare or public health challenges."
      },
      {
        question: "Are facilitators experienced professionals?",
        answer: "Yes. Our facilitators are experienced practitioners, researchers, and innovators with practical expertise in their respective fields."
      },
      {
        question: "Can I access course recordings?",
        answer: "For courses with live sessions, recordings are made available where applicable. Access details are shared during onboarding."
      },
      {
        question: "What happens if I miss a live session?",
        answer: "If recordings are available, you can catch up. However, consistent participation is encouraged, especially for cohort-based programs."
      },
    ],
  },
  {
    id: "payments",
    title: "Registration & Payments",
    icon: CreditCard,
    color: "from-green-500 to-emerald-500",
    questions: [
      {
        question: "How do I register for a course?",
        answer: "You can register directly on our website by: Selecting your preferred course, completing the registration form, and making payment (if applicable). Once registered, you will receive confirmation and onboarding details."
      },
      {
        question: "What payment methods are accepted?",
        answer: "We accept multiple payment options, including: Debit/credit cards, Bank transfers, and USSD (where available). Payment options will be shown during registration."
      },
    ],
  },
  {
    id: "certifications",
    title: "Certifications & Recognition",
    icon: Award,
    color: "from-gold to-amber-500",
    questions: [
      {
        question: "Do I receive a certificate after completion?",
        answer: "Yes. Participants who meet the course requirements receive a Certificate of Completion from Cytobiz Medical & Innovation Academy."
      },
      {
        question: "Are your certificates recognized?",
        answer: "Our Academy is recognized by the West Africa Health Business Society (WAHBS) and accredited by the Skill Development Council, Canada, which strengthens the credibility of our programs and certifications."
      },
    ],
  },
  {
    id: "community",
    title: "Community & Opportunities",
    icon: Users,
    color: "from-purple-500 to-pink-500",
    questions: [
      {
        question: "Do you offer internships or volunteer opportunities?",
        answer: "Yes. We periodically offer internship and volunteer opportunities across various departments. Announcements are made through our official channels."
      },
      {
        question: "Will I be added to a community or alumni network?",
        answer: "Yes. Upon course completion, participants gain access to our alumni and professional community, enabling networking and continued learning."
      },
      {
        question: "How can I contact Cytobiz Medical & Innovation Academy?",
        answer: "You can reach us via: Email at info.cytobizacademy@gmail.com, our website contact form, or through our official social media channels."
      },
    ],
  },
];

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter FAQ categories and questions based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return faqCategories;

    const query = searchQuery.toLowerCase();
    return faqCategories
      .map((category) => ({
        ...category,
        questions: category.questions.filter(
          (faq) =>
            faq.question.toLowerCase().includes(query) ||
            faq.answer.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.questions.length > 0);
  }, [searchQuery]);

  const totalResults = filteredCategories.reduce(
    (acc, cat) => acc + cat.questions.length,
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Frequently Asked Questions | Cytobiz Medical & Innovation Academy"
        description="Find answers to common questions about Cytobiz Medical & Innovation Academy courses, payments, certifications, and support. Get the information you need to start your learning journey."
        url="/faq"
        keywords={["FAQ", "help", "support", "questions", "courses", "certifications", "payments", "Cytobiz Academy", "medical education"]}
      />
      <Navbar />

      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[40vh] flex items-center overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background dark:from-background dark:via-primary/10 dark:to-background">
            <motion.div
              className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/20 dark:bg-primary/30 blur-[120px]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-gold/20 dark:bg-gold/30 blur-[100px]"
              animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.2, 0.4] }}
              transition={{ duration: 12, repeat: Infinity }}
            />
          </div>

          <div className="container-wide relative z-10 py-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 mb-6"
              >
                <HelpCircle className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Help Center</span>
              </motion.div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Frequently Asked
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-accent block">
                  Questions
                </span>
              </h1>

              <p className="text-lg text-muted-foreground font-medium mb-2">
                Cytobiz Medical & Innovation Academy
              </p>

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Find answers to common questions about our courses, payments, certifications, and more.
              </p>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="max-w-xl mx-auto"
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-12 py-6 text-lg rounded-2xl border-2 border-border bg-card/80 dark:bg-card/50 focus:border-primary transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
                    >
                      <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                  )}
                </div>
                {searchQuery && (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Found {totalResults} {totalResults === 1 ? "result" : "results"} for "{searchQuery}"
                  </p>
                )}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Category Quick Links - only show when not searching */}
        {!searchQuery && (
          <section className="py-8 border-b border-border bg-card/50 dark:bg-card/30">
            <div className="container-wide">
              <div className="flex flex-wrap justify-center gap-4">
                {faqCategories.map((category, index) => (
                  <motion.a
                    key={category.id}
                    href={`#${category.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-card dark:bg-card/80 border border-border hover:border-primary/50 shadow-sm transition-all"
                  >
                    <category.icon className="w-5 h-5 text-primary" />
                    <span className="font-medium text-foreground">{category.title}</span>
                  </motion.a>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ Sections */}
        <section className="section-padding">
          <div className="container-wide max-w-4xl">
            {filteredCategories.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any questions matching "{searchQuery}"
                </p>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Clear Search
                </Button>
              </motion.div>
            ) : (
            filteredCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.id}
                id={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="mb-16 last:mb-0 scroll-mt-32"
              >
                {/* Category Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}>
                    <category.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                      {category.title}
                    </h2>
                    <p className="text-muted-foreground">
                      {category.questions.length} questions
                    </p>
                  </div>
                </div>

                {/* Questions Accordion */}
                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <AccordionItem
                        value={`${category.id}-${index}`}
                        className="border border-border rounded-xl overflow-hidden bg-card dark:bg-card/80 hover:border-primary/30 transition-colors"
                      >
                        <AccordionTrigger className="px-6 py-5 text-left hover:no-underline hover:bg-muted/30 transition-colors">
                          <span className="font-medium text-foreground pr-4">
                            {faq.question}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-5 text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    </motion.div>
                  ))}
                </Accordion>
              </motion.div>
            ))
            )}
          </div>
        </section>

        {/* Still Have Questions CTA */}
        <section className="section-padding bg-muted/30 dark:bg-muted/10">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-accent" />
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.2),transparent_50%)]" />
              </div>

              <div className="relative px-8 py-16 md:py-20 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 mb-6"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">We're Here to Help</span>
                </motion.div>

                <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                  Still have questions?
                </h2>
                <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                  Our support team is ready to help you with any additional questions you may have.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    asChild
                    className="bg-white text-primary hover:bg-white/90 shadow-xl"
                  >
                    <Link to="/contact">
                      Contact Support
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Link to="/courses">
                      Browse Courses
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FAQ;
