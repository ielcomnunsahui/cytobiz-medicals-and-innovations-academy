import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
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
  },
  {
    id: 2,
    quote: "Cytobiz Academy provided the perfect blend of theoretical knowledge and practical skills. I'm now leading digital transformation at my hospital with confidence.",
    author: "Dr. Michael Okonkwo",
    role: "Director of Innovation",
    company: "Regional Medical Center",
    outcome: "Led $2M transformation initiative",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
  },
  {
    id: 3,
    quote: "The cohort-based learning model created meaningful connections with peers worldwide. The network I built here continues to drive my career and research forward.",
    author: "Dr. Elena Rodriguez",
    role: "Public Health Researcher",
    company: "Global Health Institute",
    outcome: "Published 3 research papers",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
  },
];

export function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section ref={ref} className="section-padding bg-hero-gradient text-primary-foreground">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <p className="text-primary-foreground/70 font-medium mb-3 text-sm uppercase tracking-wider">
            Learner Success Stories
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Real Impact, Real Results
          </h2>
          <p className="text-primary-foreground/60 max-w-2xl mx-auto">
            Hear from healthcare professionals who transformed their careers through our programs
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="text-center"
            >
              <Quote className="w-10 h-10 mx-auto mb-6 text-primary-foreground/20" />
              
              <blockquote className="text-xl md:text-2xl font-medium mb-6 leading-relaxed">
                "{testimonials[current].quote}"
              </blockquote>

              {/* Outcome Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/20 text-success mb-6">
                <div className="w-2 h-2 rounded-full bg-success" />
                <span className="text-sm font-medium">{testimonials[current].outcome}</span>
              </div>

              <div className="flex items-center justify-center gap-4">
                <img
                  src={testimonials[current].image}
                  alt={testimonials[current].author}
                  className="w-14 h-14 rounded-full object-cover border-2 border-primary-foreground/30"
                />
                <div className="text-left">
                  <p className="font-semibold">{testimonials[current].author}</p>
                  <p className="text-sm text-primary-foreground/70">
                    {testimonials[current].role}, {testimonials[current].company}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-10">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              className="rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === current
                      ? "w-6 bg-primary-foreground"
                      : "bg-primary-foreground/30"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={next}
              className="rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
