import { useState } from "react";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle,
  Phone,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Linkedin,
  Twitter,
  Instagram
} from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Our team will respond within 24 hours",
    value: "hello@cytobiz.academy",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Available during business hours",
    value: "+1 (555) 123-4567",
    color: "from-emerald-500 to-teal-500",
  },
  {
    icon: MapPin,
    title: "Location",
    description: "Serving learners globally",
    value: "Global Online Learning",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Clock,
    title: "Support Hours",
    description: "Monday - Friday",
    value: "9:00 AM - 6:00 PM EST",
    color: "from-amber-500 to-orange-500",
  },
];

const faqs = [
  {
    question: "How do I enroll in a course?",
    answer: "Browse our course catalog, select your preferred course, and click 'Enroll Now' to start the registration process."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept credit/debit cards via Stripe, Paystack, and direct bank transfers for your convenience."
  },
  {
    question: "Can I get a refund if I'm not satisfied?",
    answer: "Yes, we offer a 14-day money-back guarantee on all our courses if you're not completely satisfied."
  },
];

const socialLinks = [
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
];

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSuccess(true);
    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
    
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[50vh] flex items-center overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background dark:from-background dark:via-primary/10 dark:to-background">
            <motion.div 
              className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/20 dark:bg-primary/30 blur-[120px]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-accent/15 dark:bg-accent/25 blur-[100px]"
              animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.2, 0.4] }}
              transition={{ duration: 12, repeat: Infinity }}
            />
            
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
          </div>

          <div className="container-wide relative z-10 py-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 mb-8"
              >
                <MessageCircle className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">We'd Love to Hear From You</span>
              </motion.div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-[1.1]">
                Get in
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-accent"> Touch</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-2xl">
                Have questions about our courses or programs? We're here to help you on your learning journey.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="py-16 relative">
          <div className="container-wide">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group bg-card dark:bg-card/80 rounded-2xl p-6 border border-border hover:border-primary/30 transition-all duration-300"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5 shadow-lg`}
                  >
                    <item.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h3 className="font-semibold text-lg text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                  <p className="text-sm font-semibold text-primary">{item.value}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Form & FAQ Section */}
        <section className="section-padding bg-muted/30 dark:bg-muted/50">
          <div className="container-wide">
            <div className="grid lg:grid-cols-5 gap-12">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-3"
              >
                <div className="bg-card dark:bg-card/80 rounded-3xl border border-border p-8 md:p-10 shadow-lg">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                      <Send className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-display text-2xl font-bold text-foreground">
                        Send us a Message
                      </h2>
                      <p className="text-muted-foreground text-sm">Fill out the form and we'll respond within 24 hours.</p>
                    </div>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                      >
                        <Label htmlFor="name" className="text-foreground">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="John Doe"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="h-12 bg-background border-2 focus:border-primary transition-colors"
                        />
                      </motion.div>
                      <motion.div 
                        className="space-y-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.15 }}
                      >
                        <Label htmlFor="email" className="text-foreground">Email Address</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="h-12 bg-background border-2 focus:border-primary transition-colors"
                        />
                      </motion.div>
                    </div>

                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 }}
                    >
                      <Label htmlFor="subject" className="text-foreground">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        placeholder="How can we help?"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="h-12 bg-background border-2 focus:border-primary transition-colors"
                      />
                    </motion.div>

                    <motion.div 
                      className="space-y-2"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.25 }}
                    >
                      <Label htmlFor="message" className="text-foreground">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Tell us more about your inquiry..."
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="bg-background border-2 focus:border-primary transition-colors resize-none"
                      />
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full sm:w-auto min-w-[200px] h-12"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            Sending...
                          </span>
                        ) : isSuccess ? (
                          <span className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5" />
                            Message Sent!
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            Send Message
                            <ArrowRight className="w-5 h-5" />
                          </span>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </div>
              </motion.div>

              {/* FAQ & Social */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-2 space-y-8"
              >
                {/* Quick FAQs */}
                <div className="bg-card dark:bg-card/80 rounded-2xl border border-border p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-lg text-foreground">Quick Answers</h3>
                  </div>
                  
                  <div className="space-y-5">
                    {faqs.map((faq, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="pb-5 border-b border-border last:border-0 last:pb-0"
                      >
                        <h4 className="font-medium text-foreground mb-2">{faq.question}</h4>
                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Social Links */}
                <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-6 text-white">
                  <h3 className="font-semibold text-lg mb-4">Connect With Us</h3>
                  <p className="text-white/80 text-sm mb-6">
                    Follow us on social media for updates, tips, and healthcare insights.
                  </p>
                  <div className="flex gap-3">
                    {socialLinks.map((social) => (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-12 h-12 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                        aria-label={social.label}
                      >
                        <social.icon className="w-5 h-5" />
                      </motion.a>
                    ))}
                  </div>
                </div>

                {/* Response Time */}
                <div className="bg-muted/50 dark:bg-muted/30 rounded-2xl p-6 border border-border">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Fast Response Time</h4>
                      <p className="text-sm text-muted-foreground">
                        We typically respond within 2-4 hours during business hours.
                        For urgent matters, please call us directly.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
