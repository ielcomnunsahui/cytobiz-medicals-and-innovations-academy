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
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { SEOHead } from "@/components/SEOHead";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqCategories = [
  {
    id: "courses",
    title: "Courses & Learning",
    icon: BookOpen,
    color: "from-blue-500 to-cyan-500",
    questions: [
      {
        question: "What types of courses do you offer?",
        answer: "We offer cohort-based programs and self-paced courses covering Digital Health, Public Health, Clinical Leadership, Healthcare Innovation, Research Methods, and Data Science. Cohort programs include live sessions, group projects, and facilitator mentorship, while self-paced courses let you learn at your own schedule."
      },
      {
        question: "How long do courses typically take to complete?",
        answer: "Course duration varies by program. Cohort-based programs typically run 8-12 weeks with 4-6 hours of commitment per week. Self-paced courses can be completed at your own pace, though we recommend 2-4 weeks for optimal learning."
      },
      {
        question: "Are the courses suitable for beginners?",
        answer: "Yes! We offer courses for all skill levels—from beginner to advanced. Each course clearly indicates the required experience level and prerequisites in its description. Beginner courses assume no prior knowledge in the specific topic."
      },
      {
        question: "What is the difference between cohort and self-paced courses?",
        answer: "Cohort courses run on fixed schedules with live sessions, peer collaboration, and direct facilitator interaction. Self-paced courses allow you to start anytime and progress through materials independently. Cohort programs typically offer richer networking opportunities."
      },
      {
        question: "Can I access course materials after completion?",
        answer: "Absolutely! You receive lifetime access to all course materials, including videos, readings, and resources. This allows you to revisit content whenever you need a refresher."
      },
      {
        question: "Do you offer group or corporate enrollments?",
        answer: "Yes, we offer special rates and customized programs for organizations enrolling multiple learners. Contact us for corporate partnership options and volume discounts."
      },
    ],
  },
  {
    id: "payments",
    title: "Payments & Pricing",
    icon: CreditCard,
    color: "from-green-500 to-emerald-500",
    questions: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept various payment methods including bank transfers, credit/debit cards via Paystack, and mobile payment options. All payments are processed securely with industry-standard encryption."
      },
      {
        question: "Are there any discounts available?",
        answer: "Yes! We offer promotional discount codes, early-bird pricing for upcoming cohorts, and special rates for students and healthcare workers. Check our website or subscribe to our newsletter for current offers."
      },
      {
        question: "What is your refund policy?",
        answer: "We offer a 7-day money-back guarantee from enrollment date for most courses. If you're unsatisfied with the course content, contact our support team within 7 days for a full refund. Cohort programs may have different refund policies—check course details for specifics."
      },
      {
        question: "Can I pay in installments?",
        answer: "For select premium programs, we offer payment plans that allow you to spread the cost over 2-3 installments. Contact our support team to discuss payment options for your chosen course."
      },
      {
        question: "Are course prices in USD or local currency?",
        answer: "We display prices in Nigerian Naira (NGN). International students may see approximate USD equivalents. Payment is processed in NGN, and your bank will handle any currency conversion."
      },
      {
        question: "Do I receive an invoice for my payment?",
        answer: "Yes, you'll receive a detailed invoice via email upon successful enrollment. You can also access your payment history and download invoices from your dashboard."
      },
    ],
  },
  {
    id: "certifications",
    title: "Certifications & Credentials",
    icon: Award,
    color: "from-gold to-amber-500",
    questions: [
      {
        question: "Do I receive a certificate upon completion?",
        answer: "Yes! Upon successfully completing all course requirements, you'll receive a digital certificate that you can share on LinkedIn, add to your CV, and download for printing. Certificates include a unique verification code."
      },
      {
        question: "Are your certificates recognized by employers?",
        answer: "Our certificates are valued by healthcare organizations, NGOs, and employers across Africa and globally. While not academic degrees, they demonstrate practical skills and knowledge in specialized healthcare domains."
      },
      {
        question: "What are the requirements for earning a certificate?",
        answer: "Certificate requirements vary by course but typically include completing all modules, passing quizzes or assessments with a minimum score, and for cohort programs, participating in live sessions and submitting projects."
      },
      {
        question: "How can employers verify my certificate?",
        answer: "Each certificate includes a unique verification code. Employers can verify authenticity through our online verification portal by entering this code. The verification page displays your name, course completed, and completion date."
      },
      {
        question: "Can I add the certificate to my LinkedIn profile?",
        answer: "Absolutely! We provide one-click LinkedIn integration. You can add your certificate directly to your LinkedIn profile's credentials section, including the verification URL and issue date."
      },
      {
        question: "Do certificates expire?",
        answer: "No, our certificates don't expire. However, for rapidly evolving fields like Digital Health, we recommend updating your skills periodically through our advanced courses to stay current with industry developments."
      },
    ],
  },
  {
    id: "support",
    title: "Account & Support",
    icon: Users,
    color: "from-purple-500 to-pink-500",
    questions: [
      {
        question: "How do I create an account?",
        answer: "Click 'Sign Up' on our website, enter your email and create a password. You'll receive a verification email—click the link to activate your account. You can then browse courses and enroll in programs."
      },
      {
        question: "I forgot my password. How do I reset it?",
        answer: "Click 'Forgot Password' on the login page, enter your registered email, and you'll receive a password reset link. The link expires after 24 hours for security. Contact support if you need further assistance."
      },
      {
        question: "How can I contact customer support?",
        answer: "You can reach us via email at support@cytobiz.com, through the Contact form on our website, or via WhatsApp during business hours. We typically respond within 24 hours on business days."
      },
      {
        question: "What if I need technical help during a course?",
        answer: "For technical issues, email our support team with details about the problem. Include screenshots if possible. For cohort programs, you can also reach out to your assigned facilitator for assistance."
      },
      {
        question: "Can I change my enrolled cohort after registration?",
        answer: "Cohort changes may be possible depending on availability and timing. Contact support at least 7 days before your cohort starts to request a transfer. Administrative fees may apply for last-minute changes."
      },
      {
        question: "Is my personal data secure?",
        answer: "Yes, we take data privacy seriously. We use industry-standard encryption, never share your data with third parties without consent, and comply with data protection regulations. See our Privacy Policy for full details."
      },
    ],
  },
];

const FAQ = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead
        title="Frequently Asked Questions"
        description="Find answers to common questions about Cytobiz courses, payments, certifications, and support. Get the information you need to start your learning journey."
        url="/faq"
        keywords={["FAQ", "help", "support", "questions", "courses", "certifications", "payments"]}
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

              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Find answers to common questions about our courses, payments, certifications, and more.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Category Quick Links */}
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

        {/* FAQ Sections */}
        <section className="section-padding">
          <div className="container-wide max-w-4xl">
            {faqCategories.map((category, categoryIndex) => (
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
            ))}
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
