import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, Users, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const featuredCourses = [
  {
    id: 1,
    title: "Digital Health Innovation Leadership",
    description: "Lead healthcare transformation with cutting-edge digital solutions",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop",
    duration: "8 weeks",
    students: 2450,
    rating: 4.9,
    type: "cohort",
    featured: true,
    price: "$499",
  },
  {
    id: 2,
    title: "Public Health Data Analytics",
    description: "Master data-driven decision making in public health",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    duration: "6 weeks",
    students: 1850,
    rating: 4.8,
    type: "self_paced",
    featured: true,
    price: "$349",
  },
  {
    id: 3,
    title: "Healthcare AI Implementation",
    description: "Deploy AI solutions responsibly in clinical settings",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=600&h=400&fit=crop",
    duration: "10 weeks",
    students: 980,
    rating: 4.9,
    type: "cohort",
    featured: false,
    price: "$599",
  },
  {
    id: 4,
    title: "Medical Research Methodology",
    description: "Design and execute impactful clinical research studies",
    image: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=600&h=400&fit=crop",
    duration: "12 weeks",
    students: 1200,
    rating: 4.7,
    type: "cohort",
    featured: false,
    price: "$699",
  },
  {
    id: 5,
    title: "Telemedicine Excellence",
    description: "Build effective virtual care programs and patient experiences",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600&h=400&fit=crop",
    duration: "4 weeks",
    students: 3100,
    rating: 4.8,
    type: "self_paced",
    featured: true,
    price: "$199",
  },
];

export function CourseCarousel() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });
  const scrollRef = useRef<HTMLDivElement>(null);

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
          {featuredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="min-w-[350px] max-w-[350px] snap-start"
            >
              <div className="group bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    {course.featured && (
                      <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                    )}
                    <Badge variant="secondary" className="bg-white/90 text-foreground capitalize">
                      {course.type.replace("_", "-")}
                    </Badge>
                  </div>

                  {/* Price */}
                  <div className="absolute bottom-4 right-4">
                    <span className="text-2xl font-bold text-white">{course.price}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-card-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {course.students.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {course.rating}
                    </div>
                  </div>

                  {/* CTA */}
                  <Button
                    variant="ghost"
                    className="w-full justify-between group/btn hover:bg-primary hover:text-primary-foreground"
                    asChild
                  >
                    <Link to={`/courses/${course.id}`}>
                      View Course
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
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
