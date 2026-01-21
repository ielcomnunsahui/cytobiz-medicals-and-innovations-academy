import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Clock, Users, ArrowRight, Calendar, Award } from "lucide-react";
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
    <section ref={containerRef} className="section-padding bg-muted/30">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
        >
          <div>
            <p className="text-primary font-medium mb-2 text-sm uppercase tracking-wider">
              Featured Programs
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Start Your Learning Journey
            </h2>
            <p className="text-muted-foreground mt-2 max-w-xl">
              Curated courses selected by our team for maximum impact on your healthcare career.
            </p>
          </div>

          <Button asChild variant="outline" size="lg" className="self-start md:self-auto">
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
                <Skeleton className="h-48 w-full" />
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
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={`/courses/${course.slug}`}
                  className="group flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary via-primary/80 to-primary/60">
                    {course.thumbnail_url ? (
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl font-display font-bold text-white/30">
                          {course.title.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
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
                      <Badge variant="secondary" className="bg-white/90 text-foreground">
                        <Award className="w-3 h-3 mr-1" />
                        Certificate
                      </Badge>
                    </div>

                    {/* Price */}
                    <div className="absolute bottom-4 right-4">
                      <span className="text-2xl font-bold text-white">
                        {course.price ? `$${course.price}` : "Free"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6">
                    <h3 className="font-display text-lg font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                      {course.short_description || course.description}
                    </p>

                    {/* Meta Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span>{course.duration_weeks ? `${course.duration_weeks} weeks` : "Self-paced"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span>{course.course_type === "cohort" ? "Next cohort" : "Start anytime"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 flex-shrink-0" />
                        <span>{course.level || "All levels"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>Certificate</span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-sm text-muted-foreground">
                        {course.effort_hours_per_week ? `${course.effort_hours_per_week} hrs/week` : "Flexible"}
                      </span>
                      <span className="text-sm font-medium text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                        Learn More
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            // Empty state
            <div className="col-span-3 text-center py-12">
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
