import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Clock, Users, ArrowRight, Calendar, Award, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { useCourses } from "@/hooks/useCourses";

export function FeaturedCoursesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  
  // Fetch published courses from Supabase
  const { data: courses, isLoading } = useCourses({ 
    status: "published",
    limit: 6 
  });

  const displayCourses = courses?.slice(0, 3) || [];

  return (
    <section ref={containerRef} className="py-24 bg-muted/30">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6"
        >
          <div>
            <p className="text-primary font-medium mb-3 text-sm uppercase tracking-widest">
              Featured Programs
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Start Your Journey
            </h2>
            <p className="text-muted-foreground max-w-lg text-lg">
              Curated courses selected for maximum impact on your healthcare career.
            </p>
          </div>

          <Button asChild variant="outline" size="lg" className="self-start md:self-auto h-12">
            <Link to="/courses">
              View All Courses
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>

        {/* Course Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Skeleton loaders
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-card rounded-2xl overflow-hidden border border-border">
                <Skeleton className="h-52 w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="grid grid-cols-2 gap-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </div>
            ))
          ) : displayCourses.length > 0 ? (
            displayCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
              >
                <Link
                  to={`/courses/${course.slug}`}
                  className="group flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-2xl transition-all duration-500"
                >
                  {/* Image */}
                  <div className="relative h-52 overflow-hidden bg-gradient-to-br from-primary via-primary/80 to-primary/60">
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-white/30" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    
                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <Badge 
                        className={course.course_type === "cohort" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-gold text-foreground"
                        }
                      >
                        {course.course_type === "cohort" ? "Cohort" : "Self-Paced"}
                      </Badge>
                    </div>

                    {/* Certificate Icon */}
                    <div className="absolute top-4 right-4">
                      <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                    </div>

                    {/* Price */}
                    <div className="absolute bottom-4 right-4">
                      {course.discounted_price !== null ? (
                        <div className="flex items-center gap-2">
                          <span className="text-lg text-white/70 line-through">
                            ₦{(course.original_price || course.price || 0).toLocaleString()}
                          </span>
                          <span className="text-2xl font-bold text-white drop-shadow-lg">
                            ₦{course.discounted_price.toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-2xl font-bold text-white drop-shadow-lg">
                          {course.original_price || course.price ? `₦${(course.original_price || course.price || 0).toLocaleString()}` : "Free"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6">
                    <h3 className="font-display text-xl font-semibold text-card-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-5 line-clamp-2 flex-1">
                      {course.short_description || course.description}
                    </p>

                    {/* Meta Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground mb-5">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span>{course.duration_weeks ? `${course.duration_weeks} weeks` : "Self-paced"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>{course.course_type === "cohort" ? "Next cohort" : "Start anytime"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 flex-shrink-0" />
                        <span>{course.level || "All levels"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>Certificate</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between pt-5 border-t border-border">
                      <span className="text-sm text-muted-foreground">
                        {course.effort_hours_per_week ? `${course.effort_hours_per_week} hrs/week` : "Flexible"}
                      </span>
                      <motion.span 
                        className="text-sm font-semibold text-primary inline-flex items-center gap-1"
                        whileHover={{ x: 4 }}
                      >
                        Learn More
                        <ArrowRight className="w-4 h-4" />
                      </motion.span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            // Empty state
            <div className="col-span-3 text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">No courses available yet.</p>
              <Button asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
