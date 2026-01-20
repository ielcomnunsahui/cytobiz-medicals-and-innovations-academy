import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useRef } from "react";

const floatingImages = [
  { src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&h=200&fit=crop", alt: "Medical professional", position: "top-20 right-[10%]", delay: 0 },
  { src: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=200&h=150&fit=crop", alt: "Healthcare innovation", position: "top-40 right-[25%]", delay: 0.2 },
  { src: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=250&h=180&fit=crop", alt: "Digital health", position: "bottom-32 right-[15%]", delay: 0.4 },
  { src: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=180&h=140&fit=crop", alt: "Research", position: "bottom-20 right-[30%]", delay: 0.6 },
];

export function HeroSectionEnhanced() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100vh] flex items-center overflow-hidden bg-background"
    >
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent" />

      {/* Floating Images - Harvard style */}
      <div className="absolute inset-0 overflow-hidden hidden lg:block">
        {floatingImages.map((img, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: img.delay + 0.5 }}
            className={`absolute ${img.position}`}
            style={{ y }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4 + index, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl" />
              <img
                src={img.src}
                alt={img.alt}
                className="relative rounded-2xl shadow-2xl border-4 border-white/50 object-cover"
              />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <motion.div style={{ opacity }} className="container-wide relative z-10 pt-32 pb-20">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              New Cohort Starting February 2026
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] mb-6"
          >
            <span className="text-primary">Cytobiz Academy</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Learn, Lead, Transform
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed"
          >
            Building the competence, curiosity, and confidence of healthcare
            professionals and innovators around the world through practical,
            expert-led education.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Button
              size="lg"
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all group h-14 px-8 text-lg"
            >
              <Link to="/courses">
                Explore Courses
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border hover:bg-muted h-14 px-8 text-lg group"
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Watch Overview
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2"
        >
          <motion.div
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-primary"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
