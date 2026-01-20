import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useRef } from "react";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-hero-gradient"
    >
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), 
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] opacity-60" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-accent/15 blur-[100px] opacity-50" />

      {/* Main Content */}
      <motion.div style={{ opacity }} className="container-wide relative z-10 pt-24 pb-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Authority Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8 backdrop-blur-sm"
          >
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-primary-foreground/90">
              New Cohort Starting March 2026
            </span>
          </motion.div>

          {/* Headline - Authority + Clarity */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground leading-[1.1] mb-6 tracking-tight"
          >
            Medical Education.
            <br />
            <span className="text-primary-foreground/80">Innovation.</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/70">
              Real-World Impact.
            </span>
          </motion.h1>

          {/* Subheadline - Outcome focused */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-primary-foreground/70 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Build competence, curiosity, and confidence through practical, 
            expert-led education designed for healthcare professionals and innovators.
          </motion.p>

          {/* Primary CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              asChild
              className="bg-white text-navy hover:bg-white/90 shadow-lg hover:shadow-xl transition-all group h-14 px-8 text-base font-semibold"
            >
              <Link to="/courses">
                Explore Courses
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/30 text-primary-foreground hover:bg-white/10 h-14 px-8 text-base font-semibold backdrop-blur-sm"
            >
              <Link to="/courses?type=cohort">
                <Users className="w-5 h-5 mr-2" />
                Join a Cohort
              </Link>
            </Button>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-primary-foreground/60"
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-success" />
              Certificate of Completion
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-success" />
              Expert Facilitators
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-success" />
              Global Community
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-primary-foreground/30 rounded-full flex justify-center pt-2"
        >
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-primary-foreground/60"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
