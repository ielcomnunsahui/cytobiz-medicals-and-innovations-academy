import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    id: 1,
    quote: "The Digital Health Innovation program fundamentally changed how I approach healthcare technology. The hands-on projects and expert mentorship were invaluable for my career growth.",
    author: "Dr. Sarah Chen",
    role: "Chief Medical Officer",
    company: "HealthTech Innovations",
    outcome: "Promoted within 6 months",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    rating: 5,
  },
  {
    id: 2,
    quote: "Cytobiz Academy provided the perfect blend of theoretical knowledge and practical skills. I'm now leading digital transformation at my hospital with confidence.",
    author: "Dr. Michael Okonkwo",
    role: "Director of Innovation",
    company: "Regional Medical Center",
    outcome: "Led $2M transformation initiative",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    rating: 5,
  },
  {
    id: 3,
    quote: "The cohort-based learning model created meaningful connections with peers worldwide. The network I built here continues to drive my career and research forward.",
    author: "Dr. Elena Rodriguez",
    role: "Public Health Researcher",
    company: "Global Health Institute",
    outcome: "Published 3 research papers",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    rating: 5,
  },
];

const AUTO_ROTATE_INTERVAL = 5000; // 5 seconds

export function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => setCurrent((prev) => (prev + 1) % testimonials.length), []);
  const prev = useCallback(() => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length), []);

  // Auto-rotate effect
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      next();
    }, AUTO_ROTATE_INTERVAL);

    return () => clearInterval(interval);
  }, [isPaused, next]);

  return (
    <section ref={ref} className="py-24 bg-hero-gradient text-primary-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full border border-white/20"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full border border-white/10"
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>

      <div className="container-wide relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14"
        >
          <p className="text-primary-foreground/60 font-medium mb-4 text-sm uppercase tracking-widest">
            Success Stories
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Real Impact, Real Results
          </h2>
          <p className="text-primary-foreground/50 max-w-2xl mx-auto text-lg">
            Hear from healthcare professionals who transformed their careers through our programs
          </p>
        </motion.div>

        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 md:p-12"
            >
              <Quote className="w-12 h-12 mb-8 text-primary-foreground/20" />
              
              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonials[current].rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                ))}
              </div>
              
              <blockquote className="text-xl md:text-2xl font-medium mb-8 leading-relaxed">
                "{testimonials[current].quote}"
              </blockquote>

              {/* Outcome Badge */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-success/20 text-success mb-8"
              >
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm font-semibold">{testimonials[current].outcome}</span>
              </motion.div>

              {/* Author */}
              <div className="flex items-center gap-5">
                <motion.img
                  key={testimonials[current].image}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  src={testimonials[current].image}
                  alt={testimonials[current].author}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary-foreground/30"
                />
                <div>
                  <p className="font-semibold text-lg">{testimonials[current].author}</p>
                  <p className="text-sm text-primary-foreground/60">
                    {testimonials[current].role}, {testimonials[current].company}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-6 mt-10">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="rounded-full w-12 h-12 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            {/* Progress dots with animated fill */}
            <div className="flex items-center gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className="relative h-2 rounded-full overflow-hidden transition-all duration-300"
                  style={{ width: index === current ? '2rem' : '0.5rem' }}
                >
                  <div className="absolute inset-0 bg-primary-foreground/30" />
                  {index === current && (
                    <motion.div
                      key={`progress-${current}`}
                      className="absolute inset-0 bg-primary-foreground origin-left"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isPaused ? undefined : 1 }}
                      transition={{ 
                        duration: AUTO_ROTATE_INTERVAL / 1000, 
                        ease: "linear" 
                      }}
                    />
                  )}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="rounded-full w-12 h-12 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
