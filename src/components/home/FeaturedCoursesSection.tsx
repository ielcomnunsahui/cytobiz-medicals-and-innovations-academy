import { motion } from "framer-motion";
import { ArrowRight, Clock, Users, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const featuredCourses = [
  {
    id: 1,
    title: "Digital Health Innovation & Leadership",
    description: "Master the intersection of technology and healthcare. Learn to lead digital transformation initiatives.",
    type: "cohort",
    duration: "12 weeks",
    effort: "6-8 hrs/week",
    startDate: "Feb 15, 2026",
    learners: 234,
    rating: 4.9,
    category: "Digital Health",
    image: "bg-gradient-to-br from-primary via-primary/80 to-primary/60",
  },
  {
    id: 2,
    title: "Public Health Epidemiology",
    description: "Understand disease patterns, prevention strategies, and public health response systems.",
    type: "self-paced",
    duration: "8 weeks",
    effort: "4-5 hrs/week",
    startDate: "Start anytime",
    learners: 1823,
    rating: 4.8,
    category: "Public Health",
    image: "bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400",
  },
  {
    id: 3,
    title: "AI in Clinical Decision Making",
    description: "Explore how artificial intelligence is transforming diagnostics, treatment planning, and patient outcomes.",
    type: "cohort",
    duration: "10 weeks",
    effort: "5-6 hrs/week",
    startDate: "Mar 1, 2026",
    learners: 156,
    rating: 4.9,
    category: "Healthcare Innovation",
    image: "bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-500",
  },
];

export function FeaturedCoursesSection() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
        >
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Featured Courses
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              Start Your Learning Journey
            </h2>
          </div>
          <Button variant="outline" asChild className="self-start md:self-auto">
            <Link to="/courses">
              View All Courses
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </motion.div>

        {/* Course Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map((course, index) => (
            <motion.article
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group"
            >
              <Link
                to={`/courses/${course.id}`}
                className="flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image */}
                <div className={cn("relative aspect-video", course.image)}>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge
                      variant={course.type === "cohort" ? "default" : "secondary"}
                      className={cn(
                        course.type === "cohort"
                          ? "bg-primary text-primary-foreground"
                          : "bg-gold/90 text-foreground"
                      )}
                    >
                      {course.type === "cohort" ? "Cohort" : "Self-Paced"}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-xs font-medium text-white/80 uppercase tracking-wider">
                      {course.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                    {course.description}
                  </p>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{course.startDate}</span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-gold fill-gold" />
                      <span className="font-medium text-foreground">{course.rating}</span>
                      <span className="text-muted-foreground">
                        ({course.learners.toLocaleString()})
                      </span>
                    </div>
                    <span className="text-sm font-medium text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Learn more
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
