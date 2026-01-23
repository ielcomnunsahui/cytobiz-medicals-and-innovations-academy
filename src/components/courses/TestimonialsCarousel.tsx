import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Quote, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSuccessStories } from "@/hooks/useSuccessStories";

export function TestimonialsCarousel() {
  const { data: stories, isLoading } = useSuccessStories();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!stories?.length || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % stories.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [stories, isPaused]);

  const handlePrev = () => {
    if (!stories?.length) return;
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  const handleNext = () => {
    if (!stories?.length) return;
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  if (isLoading) {
    return (
      <div className="w-full py-16">
        <div className="container-wide">
          <div className="h-64 bg-muted/30 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!stories?.length) {
    return null;
  }

  const currentStory = stories[currentIndex];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background dark:from-muted/10 dark:to-background" />
      <motion.div
        className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-gold/10 dark:bg-gold/20 blur-[100px]"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <div className="container-wide relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 dark:bg-gold/20 text-gold border border-gold/20 text-sm font-medium mb-4">
            <Star className="w-4 h-4 fill-gold" />
            Student Success Stories
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
            What Our Learners Say
          </h2>
        </motion.div>

        {/* Carousel */}
        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-card dark:bg-card/80 rounded-3xl p-8 md:p-12 border border-border shadow-xl"
            >
              <Quote className="w-12 h-12 text-primary/20 mb-6" />
              
              <blockquote className="text-lg md:text-xl text-foreground leading-relaxed mb-8">
                "{currentStory.testimonial}"
              </blockquote>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-14 h-14 border-2 border-primary/20">
                    <AvatarImage src={currentStory.image_url || undefined} alt={currentStory.name} />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {currentStory.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{currentStory.name}</p>
                      {currentStory.linkedin_url && (
                        <a
                          href={currentStory.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    {(currentStory.title || currentStory.company) && (
                      <p className="text-sm text-muted-foreground">
                        {currentStory.title}
                        {currentStory.title && currentStory.company && " at "}
                        {currentStory.company}
                      </p>
                    )}
                  </div>
                </div>

                {/* Rating */}
                {currentStory.rating && (
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < currentStory.rating!
                            ? "text-gold fill-gold"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {currentStory.outcome && (
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-success">Outcome: </span>
                    {currentStory.outcome}
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-full bg-card shadow-lg border-border hover:bg-muted z-10"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-full bg-card shadow-lg border-border hover:bg-muted z-10"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {stories.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "w-8 bg-primary"
                  : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
              }`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        {!isPaused && (
          <div className="max-w-4xl mx-auto mt-4">
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                key={currentIndex}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 6, ease: "linear" }}
                className="h-full bg-primary"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
