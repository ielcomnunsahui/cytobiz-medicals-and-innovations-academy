import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    id: 1,
    quote: "The Digital Health Innovation program transformed how I approach healthcare technology. The hands-on projects and expert mentorship were invaluable.",
    author: "Dr. Sarah Chen",
    role: "Chief Medical Officer",
    company: "HealthTech Innovations",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
  },
  {
    id: 2,
    quote: "Cytobiz Academy provided the perfect blend of theoretical knowledge and practical skills. I'm now leading digital transformation at my hospital.",
    author: "Dr. Michael Okonkwo",
    role: "Director of Innovation",
    company: "Regional Medical Center",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
  },
  {
    id: 3,
    quote: "The cohort-based learning model created meaningful connections with peers worldwide. The network I built here continues to drive my career forward.",
    author: "Dr. Elena Rodriguez",
    role: "Public Health Researcher",
    company: "Global Health Institute",
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
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Learners Say
          </h2>
          <p className="text-primary-foreground/70 max-w-2xl mx-auto">
            Join thousands of healthcare professionals who have transformed their careers
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
              <Quote className="w-12 h-12 mx-auto mb-6 text-primary-foreground/30" />
              
              <blockquote className="text-xl md:text-2xl font-medium mb-8 leading-relaxed">
                "{testimonials[current].quote}"
              </blockquote>

              <div className="flex items-center justify-center gap-4">
                <img
                  src={testimonials[current].image}
                  alt={testimonials[current].author}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary-foreground/30"
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
              className="rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
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
              className="rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
