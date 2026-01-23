import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Users, Sparkles, Play, ChevronDown } from "lucide-react";
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

  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 50]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Animated Background with Parallax */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0"
      >
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${heroBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        {/* Gradient Overlay - Cytobiz Blue */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(252,50%,8%)] via-[hsl(252,60%,15%)] to-[hsl(252,80%,25%)] opacity-95" />
      </motion.div>

      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Primary orb - top right */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="absolute -top-32 -right-32 w-[600px] h-[600px]"
        >
          <div className="w-full h-full rounded-full bg-primary/30 blur-[120px]" />
        </motion.div>

        {/* Secondary orb - bottom left */}
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px]"
        >
          <div className="w-full h-full rounded-full bg-accent/25 blur-[100px]" />
        </motion.div>

        {/* Accent orb - center */}
        <motion.div 
          animate={{ 
            y: [-20, 20, -20],
            x: [-10, 10, -10],
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]"
        >
          <div className="w-full h-full rounded-full bg-gradient-radial from-primary/10 to-transparent blur-[80px]" />
        </motion.div>
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), 
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-white/20"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div 
        style={{ opacity, scale }} 
        className="container-wide relative z-10 pt-32 pb-20"
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 mb-8 backdrop-blur-md"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--gold))]" />
            </motion.div>
            <span className="text-sm font-medium text-white/90 tracking-wide">
              Transforming Healthcare Education
            </span>
          </motion.div>

          {/* Main Headlines with Staggered Animation */}
          <div className="space-y-2 mb-8">
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: 120, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.05] tracking-tight"
              >
                Medical Education.
              </motion.h1>
            </div>
            
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: 120, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] tracking-tight"
              >
                <span className="text-white/60">Innovation.</span>
              </motion.h1>
            </div>
            
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: 120, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[1.05] tracking-tight"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-[hsl(var(--gold))] to-white/80">
                  Real-World Impact.
                </span>
              </motion.h1>
            </div>
          </div>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-lg sm:text-xl md:text-2xl text-white/50 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
          >
            A learning hub focused on practical medical training, public health, 
            healthcare innovation, and digital health. 
            <span className="text-white/70 font-normal"> Job-relevant skills for today's 
            healthcare system.</span>
          </motion.p>

          {/* CTAs with Enhanced Hover Effects */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              asChild
              className="group relative bg-white text-foreground hover:bg-white shadow-lg hover:shadow-2xl hover:shadow-white/20 transition-all duration-500 h-14 sm:h-16 px-8 sm:px-10 text-base font-semibold overflow-hidden rounded-xl"
            >
              <Link to="/courses">
                <span className="relative z-10 flex items-center gap-2">
                  Explore Courses
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </Link>
            </Button>
            <Button
              size="lg"
              asChild
              className="group relative bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-foreground shadow-lg hover:shadow-2xl transition-all duration-500 h-14 sm:h-16 px-8 sm:px-10 text-base font-semibold overflow-hidden rounded-xl"
            >
              <Link to="/courses?type=cohort">
                <span className="relative z-10 flex items-center gap-2">
                  <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Join a Cohort
                </span>
              </Link>
            </Button>
          </motion.div>

          {/* Animated Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16 sm:mt-20 flex flex-wrap justify-center gap-x-8 sm:gap-x-12 gap-y-4 text-sm text-white/40"
          >
            {[
              { label: "Certificate of Completion", icon: "🎓" },
              { label: "Expert Facilitators", icon: "👨‍🏫" },
              { label: "Global Community", icon: "🌍" },
              { label: "Applied Projects", icon: "💼" },
            ].map((item, index) => (
              <motion.div 
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 + index * 0.1 }}
                className="flex items-center gap-2 group cursor-default"
              >
                <motion.div 
                  className="w-2 h-2 rounded-full bg-[hsl(var(--success))]"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                />
                <span className="group-hover:text-white/60 transition-colors duration-300">
                  {item.label}
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
        className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-3"
        >
          <span className="text-xs text-white/30 tracking-[0.2em] uppercase font-medium">
            Scroll
          </span>
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ 
                y: [0, 12, 0],
                opacity: [1, 0.3, 1] 
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-white/60"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
