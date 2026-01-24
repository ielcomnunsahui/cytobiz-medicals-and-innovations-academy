import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, Users, ArrowRight, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { useCourses } from "@/hooks/useCourses";

export function CourseCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: courses, isLoading } = useCourses({ status: "published", limit: 8 });

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section ref={containerRef} className="section-padding bg-muted/30">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <p className="text-primary font-medium mb-2">Our Courses</p>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Unlock world-class learning with{" "}
              <span className="text-primary">Cytobiz Academy</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-2xl">
              Flexible, expert-led courses designed to sharpen your skills and elevate
              your healthcare career.
            </p>
          </div>

          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              className="rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              className="rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="min-w-[350px] max-w-[350px] snap-start">
                  <div className="bg-card rounded-2xl overflow-hidden border border-border">
                    <Skeleton className="h-48 w-full" />
                    <div className="p-6 space-y-4">
                      <Skeleton className="h-6 w-5/6" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                </div>
              ))
            : (courses ?? []).map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="min-w-[350px] max-w-[350px] snap-start"
                >
                  <Link
                    to={`/courses/${course.slug}`}
                    className="group block bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary via-primary/80 to-primary/60">
                      {course.thumbnail_url ? (
                        <img
                          src={course.thumbnail_url}
                          alt={`${course.title} course thumbnail`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-5xl font-display font-bold text-white/30">
                            {course.title.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        <Badge className="bg-primary text-primary-foreground">Certificate</Badge>
                        <Badge variant="secondary" className="bg-white/90 text-foreground capitalize">
                          {course.course_type === "cohort" ? "cohort" : "self-paced"}
                        </Badge>
                      </div>

                      {/* Price */}
                      <div className="absolute bottom-4 right-4">
                        {course.discounted_price !== null ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg text-white/70 line-through">
                              ₦{(course.original_price || course.price || 0).toLocaleString()}
                            </span>
                            <span className="text-2xl font-bold text-white">
                              ₦{course.discounted_price.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-2xl font-bold text-white">
                            {course.original_price || course.price ? `₦${(course.original_price || course.price || 0).toLocaleString()}` : "Free"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {course.short_description || course.description || ""}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration_weeks ? `${course.duration_weeks} weeks` : "Flexible"}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>Community</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          <span>Certificate</span>
                        </div>
                      </div>

                      {/* CTA */}
                      <Button
                        variant="ghost"
                        className="w-full justify-between group/btn hover:bg-primary hover:text-primary-foreground"
                      >
                        View Course
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="text-center mt-10"
        >
          <Button asChild size="lg" variant="outline">
            <Link to="/courses">
              View All Courses
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
