import { useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, Users, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { useCourses } from "@/hooks/useCourses";

function getCourseImageAlt(title: string) {
  return `${title} course thumbnail`;
}

export function CourseCarouselSection() {
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { data: courses, isLoading } = useCourses({ status: "published", limit: 12 });
  const displayCourses = useMemo(() => courses ?? [], [courses]);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 300);
    }
  };

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4"
        >
          <div>
            <p className="text-primary font-medium mb-2 text-sm uppercase tracking-wider">
              Explore More
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Browse All Courses
            </h2>
            <p className="text-muted-foreground mt-2">
              Discover courses across all practice areas
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="rounded-full"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="rounded-full"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </motion.div>

        {/* Carousel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="relative -mx-4 px-4"
        >
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-[300px] snap-start">
                    <div className="bg-card rounded-xl overflow-hidden border border-border h-full flex flex-col">
                      <Skeleton className="h-40 w-full" />
                      <div className="p-4 space-y-3">
                        <Skeleton className="h-5 w-5/6" />
                        <Skeleton className="h-4 w-full" />
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              : displayCourses.map((course, idx) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.35, delay: Math.min(idx, 6) * 0.06 }}
                    className="group flex-shrink-0 w-[300px] snap-start"
                  >
                    <Link to={`/courses/${course.slug}`} className="block h-full">
                      <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                        {/* Image */}
                        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary via-primary/80 to-primary/60">
                          {course.thumbnail_url ? (
                            <img
                              src={course.thumbnail_url}
                              alt={getCourseImageAlt(course.title)}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-4xl font-display font-bold text-white/30">
                                {course.title.charAt(0)}
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                          {/* Badge */}
                          <Badge
                            className={`absolute top-3 left-3 ${
                              course.course_type === "cohort"
                                ? "bg-primary text-primary-foreground"
                                : "bg-gold text-foreground"
                            }`}
                          >
                            {course.course_type === "cohort" ? "Cohort" : "Self-Paced"}
                          </Badge>

                          {/* Certificate icon (static, not mock data) */}
                          <Award className="absolute top-3 right-3 w-5 h-5 text-white" />
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {course.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                            {course.short_description || course.description || ""}
                          </p>

                          <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t border-border">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              <span>
                                {course.duration_weeks ? `${course.duration_weeks} weeks` : "Flexible"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Users className="w-4 h-4" />
                              <span>Enrolled</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
          </div>
        </motion.div>

        {/* View All Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="text-center mt-8"
        >
          <Button asChild variant="outline" size="lg">
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
