import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSuccessStories } from "@/hooks/useSuccessStories";

const AUTO_ROTATE_INTERVAL = 5000; // 5 seconds

// Fallback testimonials when database is empty
const fallbackTestimonials = [
  {
    id: "fallback-1",
    name: "Dr. Sarah Chen",
    testimonial: "The Digital Health Innovation program fundamentally changed how I approach healthcare technology. The hands-on projects and expert mentorship were invaluable for my career growth.",
    title: "Chief Medical Officer",
    company: "HealthTech Innovations",
    outcome: "Promoted within 6 months",
    image_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    rating: 5,
    linkedin_url: null,
  },
  {
    id: "fallback-2",
    name: "Dr. Michael Okonkwo",
    testimonial: "Cytobiz Academy provided the perfect blend of theoretical knowledge and practical skills. I'm now leading digital transformation at my hospital with confidence.",
    title: "Director of Innovation",
    company: "Regional Medical Center",
    outcome: "Led $2M transformation initiative",
    image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    rating: 5,
    linkedin_url: null,
  },
];

export function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const { data: successStories, isLoading } = useSuccessStories();

  // Use database data or fallback
  const testimonials = successStories && successStories.length > 0 
    ? successStories 
    : fallbackTestimonials;

  const next = useCallback(() => setCurrent((prev) => (prev + 1) % testimonials.length), [testimonials.length]);
  const prev = useCallback(() => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length), [testimonials.length]);

  // Reset current index if testimonials change
  useEffect(() => {
    if (current >= testimonials.length) {
      setCurrent(0);
    }
  }, [testimonials.length, current]);

  // Auto-rotate effect
  useEffect(() => {
    if (isPaused || testimonials.length === 0) return;
    
    const interval = setInterval(() => {
      next();
    }, AUTO_ROTATE_INTERVAL);

    return () => clearInterval(interval);
  }, [isPaused, next, testimonials.length]);

  if (isLoading) {
    return (
      <section className="py-24 bg-hero-gradient text-primary-foreground relative overflow-hidden">
        <div className="container-wide">
          <div className="text-center mb-14">
            <Skeleton className="h-4 w-32 mx-auto mb-4 bg-white/20" />
            <Skeleton className="h-12 w-64 mx-auto mb-6 bg-white/20" />
            <Skeleton className="h-6 w-80 mx-auto bg-white/20" />
          </div>
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-80 rounded-3xl bg-white/10" />
          </div>
        </div>
      </section>
    );
  }

  const currentTestimonial = testimonials[current];
  if (!currentTestimonial) return null;

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
                {Array.from({ length: currentTestimonial.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold text-gold" />
                ))}
              </div>
              
              <blockquote className="text-xl md:text-2xl font-medium mb-8 leading-relaxed">
                "{currentTestimonial.testimonial}"
              </blockquote>

              {/* Outcome Badge */}
              {currentTestimonial.outcome && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-success/20 text-success mb-8"
                >
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                  <span className="text-sm font-semibold">{currentTestimonial.outcome}</span>
                </motion.div>
              )}

              {/* Author */}
              <div className="flex items-center gap-5">
                <motion.img
                  key={currentTestimonial.image_url}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  src={currentTestimonial.image_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"}
                  alt={currentTestimonial.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary-foreground/30"
                />
                <div className="flex-1">
                  <p className="font-semibold text-lg">{currentTestimonial.name}</p>
                  <p className="text-sm text-primary-foreground/60">
                    {currentTestimonial.title}
                    {currentTestimonial.company && `, ${currentTestimonial.company}`}
                  </p>
                </div>
                {currentTestimonial.linkedin_url && (
                  <a
                    href={currentTestimonial.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    aria-label={`View ${currentTestimonial.name}'s LinkedIn profile`}
                  >
                    <Linkedin className="w-5 h-5" />
                  </a>
                )}
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
