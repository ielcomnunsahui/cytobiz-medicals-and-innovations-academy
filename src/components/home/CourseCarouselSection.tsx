import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, Users, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

// More courses for carousel - will come from Supabase
const allCourses = [
  {
    id: 1,
    slug: "clinical-trials-management",
    title: "Clinical Trials Management",
    description: "Master the end-to-end process of clinical trial design and execution.",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=250&fit=crop",
    duration: "6 weeks",
    students: 1240,
    type: "cohort",
    hasCertificate: true,
  },
  {
    id: 2,
    slug: "health-economics",
    title: "Health Economics Fundamentals",
    description: "Understand healthcare financing, pricing, and economic evaluation methods.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
    duration: "4 weeks",
    students: 890,
    type: "self_paced",
    hasCertificate: true,
  },
  {
    id: 3,
    slug: "telemedicine-implementation",
    title: "Telemedicine Implementation",
    description: "Design and deploy telemedicine solutions for modern healthcare delivery.",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=250&fit=crop",
    duration: "5 weeks",
    students: 670,
    type: "cohort",
    hasCertificate: true,
  },
  {
    id: 4,
    slug: "biostatistics-essentials",
    title: "Biostatistics Essentials",
    description: "Statistical methods for clinical research and healthcare data analysis.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
    duration: "8 weeks",
    students: 1450,
    type: "self_paced",
    hasCertificate: true,
  },
  {
    id: 5,
    slug: "medical-device-regulation",
    title: "Medical Device Regulation",
    description: "Navigate FDA and CE marking requirements for medical devices.",
    image: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=250&fit=crop",
    duration: "4 weeks",
    students: 520,
    type: "self_paced",
    hasCertificate: true,
  },
  {
    id: 6,
    slug: "healthcare-quality-improvement",
    title: "Healthcare Quality Improvement",
    description: "Implement QI methodologies to enhance patient outcomes and safety.",
    image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=250&fit=crop",
    duration: "6 weeks",
    students: 780,
    type: "cohort",
    hasCertificate: true,
  },
];

export function CourseCarouselSection() {
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
            {allCourses.map((course) => (
              <Link
                key={course.id}
                to={`/courses/${course.slug}`}
                className="group flex-shrink-0 w-[300px] snap-start"
              >
                <div className="bg-card rounded-xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    {/* Badge */}
                    <Badge
                      className={`absolute top-3 left-3 ${
                        course.type === "cohort"
                          ? "bg-primary text-primary-foreground"
                          : "bg-gold text-foreground"
                      }`}
                    >
                      {course.type === "cohort" ? "Cohort" : "Self-Paced"}
                    </Badge>
                    
                    {course.hasCertificate && (
                      <Award className="absolute top-3 right-3 w-5 h-5 text-white" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                      {course.description}
                    </p>

                    <div className="flex items-center justify-between text-sm text-muted-foreground pt-3 border-t border-border">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
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
