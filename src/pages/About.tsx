import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  ArrowRight, 
  Target, 
  Eye, 
  Users, 
  Sparkles, 
  GraduationCap,
  Globe2,
  Heart,
  Zap,
  Award,
  TrendingUp,
  BookOpen
} from "lucide-react";
import teamPhoto from "@/assets/team-photo.jpeg";

const values = [
  {
    icon: Target,
    title: "Practical Impact",
    description: "Every course is designed for immediate real-world application, not just theoretical knowledge.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Eye,
    title: "Evidence-Based",
    description: "Our curriculum is grounded in the latest research, clinical guidelines, and best practices.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Users,
    title: "Community-Driven",
    description: "Learn alongside peers from around the world and build lasting professional relationships.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Sparkles,
    title: "Innovation-Focused",
    description: "Stay ahead with cutting-edge content on emerging technologies and healthcare trends.",
    color: "from-emerald-500 to-teal-500",
  },
];

const stats = [
  { value: "5K+", label: "Active Learners", icon: Users },
  { value: "50+", label: "Expert Courses", icon: BookOpen },
  { value: "40+", label: "Countries", icon: Globe2 },
  { value: "98%", label: "Completion Rate", icon: TrendingUp },
];

const milestones = [
  { year: "2020", title: "Founded", description: "Cytobiz Academy was born with a vision to transform healthcare education." },
  { year: "2021", title: "First 1,000 Students", description: "Reached our first major milestone of enrolling 1,000 healthcare professionals." },
  { year: "2022", title: "Global Expansion", description: "Expanded to serve learners in over 30 countries across 5 continents." },
  { year: "2023", title: "Industry Recognition", description: "Received recognition as a leading digital health education platform." },
  { year: "2024", title: "Innovation Hub", description: "Launched our healthcare innovation incubator program." },
];

const About = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* Hero Section */}
        <section ref={heroRef} className="relative min-h-[80vh] flex items-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img 
              src={teamPhoto} 
              alt="Cytobiz Medical Team" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60 dark:from-background/98 dark:via-background/85 dark:to-background/70" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            
            {/* Gradient orbs */}
            <motion.div 
              className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-primary/10 dark:bg-primary/20 blur-[120px]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-accent/10 dark:bg-accent/15 blur-[100px]"
              animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.2, 0.4] }}
              transition={{ duration: 12, repeat: Infinity }}
            />
          </div>

          <motion.div 
            style={{ y: heroY, opacity: heroOpacity }}
            className="container-wide relative z-10"
          >
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 mb-8"
              >
                <Heart className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">About Cytobiz Academy</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-8 leading-[1.1]"
              >
                Transforming Healthcare
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-accent">
                  Education for the Modern Era
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10 leading-relaxed"
              >
                We're on a mission to democratize access to world-class medical and public health education, 
                empowering healthcare professionals to create real-world impact.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Button size="lg" asChild className="group">
                  <Link to="/courses">
                    Explore Courses
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/contact">Get in Touch</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-primary/30 rounded-full flex items-start justify-center p-1"
            >
              <motion.div className="w-1.5 h-2.5 bg-primary rounded-full" />
            </motion.div>
          </motion.div>
        </section>

        {/* Stats Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-muted/30 dark:bg-muted/50" />
          <div className="container-wide relative">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-card dark:bg-card/80 rounded-2xl p-6 border border-border text-center group cursor-default"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <stat.icon className="w-7 h-7 text-primary" />
                  </div>
                  <motion.div
                    initial={{ scale: 0.5 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 200, delay: index * 0.1 + 0.2 }}
                    className="text-4xl md:text-5xl font-bold text-foreground mb-2"
                  >
                    {stat.value}
                  </motion.div>
                  <p className="text-muted-foreground font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="section-padding">
          <div className="container-wide">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-sm font-medium mb-6"
                >
                  <Zap className="w-4 h-4" />
                  Our Purpose
                </motion.div>
                
                <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8 leading-tight">
                  Bridging the Gap in
                  <span className="text-primary block">Healthcare Education</span>
                </h2>
                
                <div className="space-y-6 text-lg text-muted-foreground">
                  <p>
                    Cytobiz Medical & Innovation Academy was founded with a singular purpose: 
                    to bridge the gap between traditional medical education and the rapidly evolving 
                    demands of modern healthcare.
                  </p>
                  <p>
                    We believe that healthcare professionals deserve access to practical, 
                    innovation-driven education that prepares them for the challenges of tomorrow—not 
                    just the realities of today.
                  </p>
                </div>

                <div className="mt-10 flex flex-wrap gap-4">
                  <Button size="lg" asChild className="group">
                    <Link to="/courses">
                      Start Learning
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative aspect-square max-w-lg mx-auto">
                  {/* Decorative circles */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-8 rounded-full border-2 border-dashed border-accent/20"
                  />
                  
                  {/* Center icon */}
                  <div className="absolute inset-16 bg-gradient-to-br from-primary/20 to-accent/20 dark:from-primary/30 dark:to-accent/30 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-24 h-24 text-primary" />
                  </div>

                  {/* Floating icons */}
                  {[
                    { Icon: Heart, position: "top-4 left-1/2 -translate-x-1/2", delay: 0 },
                    { Icon: Globe2, position: "right-4 top-1/2 -translate-y-1/2", delay: 0.5 },
                    { Icon: Award, position: "bottom-4 left-1/2 -translate-x-1/2", delay: 1 },
                    { Icon: Sparkles, position: "left-4 top-1/2 -translate-y-1/2", delay: 1.5 },
                  ].map(({ Icon, position, delay }, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", delay: delay }}
                      className={`absolute ${position}`}
                    >
                      <motion.div
                        animate={{ y: [-5, 5, -5] }}
                        transition={{ duration: 3, repeat: Infinity, delay: delay }}
                        className="w-14 h-14 bg-card dark:bg-card/80 rounded-2xl shadow-lg border border-border flex items-center justify-center"
                      >
                        <Icon className="w-7 h-7 text-primary" />
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="section-padding bg-muted/30 dark:bg-muted/50">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                Our Journey
              </h2>
              <p className="text-lg text-muted-foreground">
                From a bold idea to a global healthcare education platform.
              </p>
            </motion.div>

            <div className="relative max-w-4xl mx-auto">
              {/* Timeline line */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border" />

              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`relative flex items-center mb-12 ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", delay: index * 0.1 + 0.2 }}
                    className="absolute left-4 md:left-1/2 w-4 h-4 -translate-x-1/2 rounded-full bg-primary border-4 border-background z-10"
                  />

                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"}`}>
                    <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-sm font-bold rounded-full mb-3">
                      {milestone.year}
                    </span>
                    <h3 className="text-xl font-bold text-foreground mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="section-padding">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                What Drives Us
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
                Our Core Values
              </h2>
              <p className="text-lg text-muted-foreground">
                These principles guide everything we do at Cytobiz Academy.
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, transition: { duration: 0.3 } }}
                  className="group relative bg-card dark:bg-card/80 rounded-2xl p-8 border border-border overflow-hidden"
                >
                  {/* Gradient hover effect */}
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br ${value.color}`} />
                  
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <value.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden"
            >
              {/* Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-accent" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
              
              <div className="relative px-8 py-16 md:py-24 text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="font-display text-3xl md:text-5xl font-bold text-white mb-6"
                >
                  Ready to Transform Your Career?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-xl text-white/80 mb-10 max-w-2xl mx-auto"
                >
                  Join thousands of healthcare professionals who are advancing their careers with Cytobiz Academy.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-wrap justify-center gap-4"
                >
                  <Button
                    size="lg"
                    asChild
                    className="bg-white text-primary hover:bg-white/90 shadow-xl"
                  >
                    <Link to="/courses">
                      Browse All Courses
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="border-white text-white hover:bg-white/10"
                  >
                    <Link to="/signup">Create Free Account</Link>
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
