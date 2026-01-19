import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Target, Eye, Users, Award, Globe2, Sparkles } from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Practical Impact",
    description: "Every course is designed for immediate real-world application, not just theoretical knowledge.",
  },
  {
    icon: Eye,
    title: "Evidence-Based",
    description: "Our curriculum is grounded in the latest research, clinical guidelines, and best practices.",
  },
  {
    icon: Users,
    title: "Community-Driven",
    description: "Learn alongside peers from around the world and build lasting professional relationships.",
  },
  {
    icon: Sparkles,
    title: "Innovation-Focused",
    description: "Stay ahead with cutting-edge content on emerging technologies and healthcare trends.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="bg-hero-gradient py-20 md:py-32">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/20 text-secondary text-sm font-medium mb-6">
                About Cytobiz Academy
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                Transforming Healthcare Education for the{" "}
                <span className="text-secondary">Modern Era</span>
              </h1>
              <p className="text-xl text-primary-foreground/70">
                We're on a mission to democratize access to world-class medical and public health education, 
                empowering healthcare professionals to create real-world impact.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission */}
        <section className="section-padding">
          <div className="container-wide">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Our Mission
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Cytobiz Medical & Innovation Academy was founded with a singular purpose: 
                  to bridge the gap between traditional medical education and the rapidly evolving 
                  demands of modern healthcare.
                </p>
                <p className="text-lg text-muted-foreground mb-6">
                  We believe that healthcare professionals deserve access to practical, 
                  innovation-driven education that prepares them for the challenges of tomorrow—not 
                  just the realities of today.
                </p>
                <div className="flex items-center gap-4">
                  <Button asChild>
                    <Link to="/courses">
                      Explore Courses
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 p-8 flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                    <div className="bg-card rounded-xl p-6 shadow-lg text-center">
                      <div className="text-3xl font-bold text-secondary mb-1">5K+</div>
                      <div className="text-sm text-muted-foreground">Active Learners</div>
                    </div>
                    <div className="bg-card rounded-xl p-6 shadow-lg text-center">
                      <div className="text-3xl font-bold text-secondary mb-1">50+</div>
                      <div className="text-sm text-muted-foreground">Expert Courses</div>
                    </div>
                    <div className="bg-card rounded-xl p-6 shadow-lg text-center">
                      <div className="text-3xl font-bold text-secondary mb-1">40+</div>
                      <div className="text-sm text-muted-foreground">Countries</div>
                    </div>
                    <div className="bg-card rounded-xl p-6 shadow-lg text-center">
                      <div className="text-3xl font-bold text-secondary mb-1">98%</div>
                      <div className="text-sm text-muted-foreground">Completion Rate</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="section-padding bg-muted/50">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto mb-12"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
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
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-6 border border-border"
                >
                  <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                    <value.icon className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="section-padding">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-hero-gradient rounded-3xl p-8 md:p-16 text-center"
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Start Learning?
              </h2>
              <p className="text-lg text-primary-foreground/70 mb-8 max-w-2xl mx-auto">
                Join thousands of healthcare professionals who are advancing their careers with Cytobiz.
              </p>
              <Button
                size="lg"
                asChild
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                <Link to="/courses">
                  Browse All Courses
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
