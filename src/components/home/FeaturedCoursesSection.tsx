import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Clock, Users, Star, ArrowRight, Calendar, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

// Admin-selectable featured courses - will come from Supabase
const featuredCourses = [
  {
    id: 1,
    slug: "digital-health-innovation",
    title: "Digital Health Innovation Leadership",
    description: "Lead healthcare transformation with cutting-edge digital solutions and innovation strategies.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop",
    duration: "8 weeks",
    effort: "5-7 hrs/week",
    students: 2450,
    rating: 4.9,
    type: "cohort",
    startDate: "Feb 15, 2026",
    hasCertificate: true,
    price: 499,
  },
  {
    id: 2,
    slug: "public-health-analytics",
    title: "Public Health Data Analytics",
    description: "Master data-driven decision making in public health settings with practical tools and frameworks.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    duration: "6 weeks",
    effort: "4-5 hrs/week",
    students: 1850,
    rating: 4.8,
    type: "self_paced",
    startDate: "Start Anytime",
    hasCertificate: true,
    price: 349,
  },
  {
    id: 3,
    slug: "healthcare-ai-implementation",
    title: "Healthcare AI Implementation",
    description: "Deploy AI solutions responsibly in clinical settings with ethical frameworks and best practices.",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=400&fit=crop",
    duration: "10 weeks",
    effort: "6-8 hrs/week",
    students: 980,
    rating: 4.9,
    type: "cohort",
    startDate: "Mar 1, 2026",
    hasCertificate: true,
    price: 599,
  },
];

export function FeaturedCoursesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

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
          {featuredCourses.map((course, index) => (
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
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <Badge 
                      className={course.type === "cohort" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-gold text-foreground"
                      }
                    >
                      {course.type === "cohort" ? "Cohort" : "Self-Paced"}
                    </Badge>
                    {course.hasCertificate && (
                      <Badge variant="secondary" className="bg-white/90 text-foreground">
                        <Award className="w-3 h-3 mr-1" />
                        Certificate
                      </Badge>
                    )}
                  </div>

                  {/* Price */}
                  <div className="absolute bottom-4 right-4">
                    <span className="text-2xl font-bold text-white">${course.price}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-6">
                  <h3 className="font-display text-lg font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                    {course.description}
                  </p>

                  {/* Meta Grid */}
                  <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 flex-shrink-0" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{course.startDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 flex-shrink-0" />
                      <span>{course.students.toLocaleString()} learners</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 fill-gold text-gold flex-shrink-0" />
                      <span>{course.rating} rating</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-sm text-muted-foreground">{course.effort}</span>
                    <span className="text-sm font-medium text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Learn More
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
