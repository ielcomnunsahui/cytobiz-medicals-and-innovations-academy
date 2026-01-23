import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useRef } from "react";
import heroBackground from "@/assets/hero-background.jpeg";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(6, 78, 59, 0.85), rgba(6, 78, 59, 0.92)), url(${heroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Animated Gradient Mesh */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 60, 
            repeat: Infinity,
            ease: "linear" 
          }}
          className="absolute -top-1/2 -right-1/2 w-full h-full"
        >
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-primary/20 blur-[150px]" />
        </motion.div>
        <motion.div 
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            duration: 45, 
            repeat: Infinity,
            ease: "linear" 
          }}
          className="absolute -bottom-1/2 -left-1/2 w-full h-full"
        >
          <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-accent/15 blur-[120px]" />
        </motion.div>
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), 
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }} />
      </div>

      {/* Main Content */}
      <motion.div 
        style={{ opacity, scale }} 
        className="container-wide relative z-10 pt-32 pb-20"
      >
        <div className="max-w-4xl mx-auto text-center">
          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 mb-10 backdrop-blur-md"
          >
            <Sparkles className="w-4 h-4 text-gold" />
            <span className="text-sm font-medium text-primary-foreground/90">
              Transforming Healthcare Education
            </span>
          </motion.div>

          {/* Main Headline with Staggered Animation */}
          <div className="overflow-hidden mb-8">
            <motion.h1
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-primary-foreground leading-[1.05] tracking-tight"
            >
              Medical Education.
            </motion.h1>
          </div>
          
          <div className="overflow-hidden mb-8">
            <motion.h1
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] tracking-tight"
            >
              <span className="text-primary-foreground/70">Innovation.</span>
            </motion.h1>
          </div>
          
          <div className="overflow-hidden mb-10">
            <motion.h1
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] tracking-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white/95 to-primary-foreground/60">
                Real-World Impact.
              </span>
            </motion.h1>
          </div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-lg sm:text-xl md:text-2xl text-primary-foreground/60 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
          >
            A learning hub focused on practical medical training, public health, 
            healthcare innovation, and digital health. Job-relevant skills for today's 
            healthcare system.
          </motion.p>

          {/* CTAs with Hover Effects */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              asChild
              className="group relative bg-white text-foreground hover:bg-white shadow-lg hover:shadow-2xl transition-all duration-500 h-16 px-10 text-base font-semibold overflow-hidden"
            >
              <Link to="/courses">
                <span className="relative z-10 flex items-center gap-2">
                  Explore Courses
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.4 }}
                />
              </Link>
            </Button>
            <Button
              size="lg"
              asChild
              className="group relative bg-transparent border-2 border-white text-white hover:bg-white hover:text-foreground shadow-lg hover:shadow-2xl transition-all duration-500 h-16 px-10 text-base font-semibold overflow-hidden"
            >
              <Link to="/courses?type=cohort">
                <span className="relative z-10 flex items-center gap-2">
                  <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Join a Cohort
                </span>
                <motion.div 
                  className="absolute inset-0 bg-white"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "0%" }}
                  transition={{ duration: 0.4 }}
                />
              </Link>
            </Button>
          </motion.div>

          {/* Animated Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-20 flex flex-wrap justify-center gap-x-10 gap-y-4 text-sm text-primary-foreground/50"
          >
            {[
              "Certificate of Completion",
              "Expert Facilitators", 
              "Global Community",
              "Applied Projects"
            ].map((item, index) => (
              <motion.div 
                key={item}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + index * 0.1 }}
                className="flex items-center gap-2 group"
              >
                <motion.div 
                  className="w-1.5 h-1.5 rounded-full bg-success"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                />
                <span className="group-hover:text-primary-foreground/70 transition-colors">
                  {item}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-xs text-primary-foreground/40 tracking-widest uppercase">
            Scroll
          </span>
          <div className="w-6 h-11 border-2 border-primary-foreground/20 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ 
                y: [0, 16, 0],
                opacity: [1, 0.3, 1] 
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-primary-foreground/50"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
