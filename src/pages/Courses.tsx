import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { 
  Search, 
  Filter, 
  Clock, 
  Users, 
  Calendar, 
  Star, 
  ArrowRight,
  X,
  ChevronDown
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const allCourses = [
  {
    id: 1,
    title: "Digital Health Innovation & Leadership",
    description: "Master the intersection of technology and healthcare. Learn to lead digital transformation initiatives in hospitals, clinics, and health tech companies.",
    type: "cohort",
    duration: "12 weeks",
    effort: "6-8 hrs/week",
    startDate: "Feb 15, 2026",
    learners: 234,
    rating: 4.9,
    category: "digital-health",
    price: 1299,
    image: "bg-gradient-to-br from-primary via-primary/80 to-primary/60",
  },
  {
    id: 2,
    title: "Public Health Epidemiology",
    description: "Understand disease patterns, prevention strategies, and public health response systems for community health improvement.",
    type: "self-paced",
    duration: "8 weeks",
    effort: "4-5 hrs/week",
    startDate: "Start anytime",
    learners: 1823,
    rating: 4.8,
    category: "public-health",
    price: 499,
    image: "bg-gradient-to-br from-blue-600 via-blue-500 to-blue-400",
  },
  {
    id: 3,
    title: "AI in Clinical Decision Making",
    description: "Explore how artificial intelligence is transforming diagnostics, treatment planning, and patient outcomes in modern healthcare.",
    type: "cohort",
    duration: "10 weeks",
    effort: "5-6 hrs/week",
    startDate: "Mar 1, 2026",
    learners: 156,
    rating: 4.9,
    category: "innovation",
    price: 1499,
    image: "bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-500",
  },
  {
    id: 4,
    title: "Clinical Research Fundamentals",
    description: "Learn the essentials of designing and conducting clinical trials, from protocol development to data analysis.",
    type: "self-paced",
    duration: "6 weeks",
    effort: "3-4 hrs/week",
    startDate: "Start anytime",
    learners: 892,
    rating: 4.7,
    category: "research",
    price: 399,
    image: "bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500",
  },
  {
    id: 5,
    title: "Healthcare Leadership & Management",
    description: "Develop essential leadership skills for managing healthcare teams, improving patient outcomes, and driving organizational change.",
    type: "cohort",
    duration: "8 weeks",
    effort: "5-6 hrs/week",
    startDate: "Apr 5, 2026",
    learners: 312,
    rating: 4.8,
    category: "clinical",
    price: 999,
    image: "bg-gradient-to-br from-rose-600 via-rose-500 to-pink-500",
  },
  {
    id: 6,
    title: "Mental Health First Aid",
    description: "Learn to identify, understand, and respond to signs of mental illness and substance use disorders.",
    type: "self-paced",
    duration: "4 weeks",
    effort: "2-3 hrs/week",
    startDate: "Start anytime",
    learners: 2156,
    rating: 4.9,
    category: "wellness",
    price: 199,
    image: "bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600",
  },
];

const categories = [
  { value: "all", label: "All Categories" },
  { value: "digital-health", label: "Digital Health" },
  { value: "public-health", label: "Public Health" },
  { value: "clinical", label: "Clinical Medicine" },
  { value: "research", label: "Medical Research" },
  { value: "wellness", label: "Health & Wellness" },
  { value: "innovation", label: "Healthcare Innovation" },
];

const types = [
  { value: "all", label: "All Types" },
  { value: "cohort", label: "Cohort Programs" },
  { value: "self-paced", label: "Self-Paced" },
];

const Courses = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("area") || "all"
  );
  const [selectedType, setSelectedType] = useState(
    searchParams.get("type") || "all"
  );
  const [showFilters, setShowFilters] = useState(false);

  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) || 
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;
    const matchesType = selectedType === "all" || course.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const activeFiltersCount = 
    (selectedCategory !== "all" ? 1 : 0) + 
    (selectedType !== "all" ? 1 : 0);

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedType("all");
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="bg-hero-gradient py-16 md:py-24">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4">
                Explore Our Courses
              </h1>
              <p className="text-lg text-primary-foreground/70">
                Discover expert-led courses designed to advance your healthcare career. 
                From cohort programs to self-paced learning.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search & Filters */}
        <section className="sticky top-16 md:top-20 z-30 bg-card/95 backdrop-blur-lg border-b border-border py-4">
          <div className="container-wide">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Desktop Filters */}
              <div className="hidden md:flex items-center gap-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 bg-background">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-40 bg-background">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {types.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground"
                  >
                    Clear filters
                    <X className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </div>

              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </div>

            {/* Mobile Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="md:hidden overflow-hidden"
                >
                  <div className="pt-4 flex flex-col gap-3">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedType} onValueChange={setSelectedType}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {types.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {activeFiltersCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-muted-foreground self-start"
                      >
                        Clear all filters
                        <X className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* Results */}
        <section className="py-12">
          <div className="container-wide">
            {/* Results Count */}
            <div className="mb-8">
              <p className="text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {filteredCourses.length}
                </span>{" "}
                {filteredCourses.length === 1 ? "course" : "courses"}
              </p>
            </div>

            {/* Course Grid */}
            {filteredCourses.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredCourses.map((course, index) => (
                    <motion.article
                      key={course.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
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
                              className={cn(
                                course.type === "cohort"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-gold/90 text-foreground"
                              )}
                            >
                              {course.type === "cohort" ? "Cohort" : "Self-Paced"}
                            </Badge>
                          </div>
                          <div className="absolute top-4 right-4">
                            <span className="px-3 py-1 rounded-full bg-card/90 backdrop-blur-sm text-sm font-semibold text-foreground">
                              ${course.price}
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
                              <span className="font-medium text-foreground">
                                {course.rating}
                              </span>
                              <span className="text-muted-foreground">
                                ({course.learners.toLocaleString()})
                              </span>
                            </div>
                            <span className="text-sm font-medium text-primary group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                              View
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  No courses found
                </h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search or filters
                </p>
                <Button onClick={clearFilters}>Clear all filters</Button>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;
