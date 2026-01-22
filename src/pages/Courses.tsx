import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import { 
  Search, 
  Clock, 
  Calendar, 
  ArrowRight,
  X,
  Award,
  Users,
  BookOpen,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useCourses } from "@/hooks/useCourses";

const categories = [
  { value: "all", label: "All Categories" },
  { value: "Digital Health", label: "Digital Health" },
  { value: "Public Health", label: "Public Health" },
  { value: "Clinical Leadership", label: "Clinical Leadership" },
  { value: "Research", label: "Research" },
  { value: "Healthcare Innovation", label: "Healthcare Innovation" },
  { value: "Leadership", label: "Leadership" },
  { value: "Data Science", label: "Data Science" },
];

const types = [
  { value: "all", label: "All Types" },
  { value: "cohort", label: "Cohort Programs" },
  { value: "self_paced", label: "Self-Paced" },
];

const Courses = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("area") || "all"
  );
  const [selectedType, setSelectedType] = useState(
    searchParams.get("type") === "cohort" ? "cohort" : 
    searchParams.get("type") === "self-paced" ? "self_paced" : "all"
  );
  const [showFilters, setShowFilters] = useState(false);

  // Fetch courses from Supabase
  const { data: courses, isLoading } = useCourses({ status: "published" });

  const filteredCourses = (courses || []).filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) || 
      (course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;
    const matchesType = selectedType === "all" || course.course_type === selectedType;
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
        {/* Hero Section */}
        <section className="bg-hero-gradient py-20 md:py-28 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/20 blur-[100px]"
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-0 left-1/4 w-[300px] h-[300px] rounded-full bg-accent/15 blur-[80px]"
              animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.2, 0.4] }}
              transition={{ duration: 10, repeat: Infinity }}
            />
          </div>

          <div className="container-wide relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-sm"
              >
                <Sparkles className="w-4 h-4 text-gold" />
                <span className="text-sm font-medium text-primary-foreground/80">
                  Explore Our Programs
                </span>
              </motion.div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
                Build Your Healthcare
                <br />
                <span className="text-primary-foreground/70">Career</span>
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/60 max-w-2xl">
                Discover expert-led courses in medical education, public health, 
                healthcare innovation, and digital health. From cohort programs 
                to self-paced learning.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search & Filters Bar */}
        <section className="sticky top-16 md:top-20 z-30 bg-card/95 backdrop-blur-xl border-b border-border py-5 shadow-sm">
          <div className="container-wide">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <motion.div 
                className="relative flex-1 max-w-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search courses by title or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-background border-2 border-border focus:border-primary transition-colors"
                />
              </motion.div>

              {/* Desktop Filters */}
              <motion.div 
                className="hidden md:flex items-center gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-52 h-12 bg-background border-2">
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
                  <SelectTrigger className="w-44 h-12 bg-background border-2">
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
                    className="text-muted-foreground hover:text-destructive"
                  >
                    Clear all
                    <X className="w-4 h-4 ml-1" />
                  </Button>
                )}
              </motion.div>

              {/* Mobile Filter Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden h-12 border-2"
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground">
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
                  transition={{ duration: 0.3 }}
                  className="md:hidden overflow-hidden"
                >
                  <div className="pt-4 flex flex-col gap-3">
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="bg-background h-12 border-2">
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
                      <SelectTrigger className="bg-background h-12 border-2">
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

        {/* Results Section */}
        <section className="py-12 md:py-16">
          <div className="container-wide">
            {/* Results Count */}
            <motion.div 
              className="mb-8 flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {isLoading ? "..." : filteredCourses.length}
                </span>{" "}
                {filteredCourses.length === 1 ? "course" : "courses"}
              </p>
            </motion.div>

            {/* Course Grid */}
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="bg-card rounded-2xl overflow-hidden border border-border">
                    <Skeleton className="h-52 w-full" />
                    <div className="p-6 space-y-4">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                      <div className="grid grid-cols-2 gap-3 pt-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredCourses.map((course, index) => (
                    <motion.article
                      key={course.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="group"
                    >
                      <Link
                        to={`/courses/${course.slug}`}
                        className="flex flex-col h-full bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/30 hover:shadow-2xl transition-all duration-500"
                      >
                        {/* Image */}
                        <div className="relative aspect-[16/10] bg-gradient-to-br from-primary via-primary/80 to-primary/60 overflow-hidden">
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
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          
                          {/* Badges */}
                          <div className="absolute top-4 left-4 flex gap-2">
                            <Badge
                              className={cn(
                                "backdrop-blur-sm",
                                course.course_type === "cohort"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-gold/90 text-foreground"
                              )}
                            >
                              {course.course_type === "cohort" ? "Cohort" : "Self-Paced"}
                            </Badge>
                          </div>
                          
                          {/* Price */}
                          <div className="absolute bottom-4 right-4">
                            <span className="px-4 py-1.5 rounded-full bg-card/90 backdrop-blur-md text-lg font-bold text-foreground shadow-lg">
                              {course.price ? `$${course.price}` : "Free"}
                            </span>
                          </div>

                          {/* Certificate badge */}
                          <div className="absolute top-4 right-4">
                            <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                              <Award className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex flex-col flex-1 p-6">
                          <h3 className="font-display text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2">
                            {course.title}
                          </h3>
                          <p className="text-muted-foreground mb-5 line-clamp-2 flex-1 text-sm leading-relaxed">
                            {course.short_description || course.description}
                          </p>

                          {/* Meta */}
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-5">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>{course.duration_weeks ? `${course.duration_weeks} weeks` : "Flexible"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              <span>{course.course_type === "cohort" ? "Next cohort" : "Start anytime"}</span>
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-5 border-t border-border">
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium text-foreground capitalize">
                                {course.level || "All levels"}
                              </span>
                            </div>
                            <motion.span 
                              className="text-sm font-semibold text-primary inline-flex items-center gap-1"
                              whileHover={{ x: 4 }}
                            >
                              View Course
                              <ArrowRight className="w-4 h-4" />
                            </motion.span>
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
                className="text-center py-20"
              >
                <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-6" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No courses found
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We couldn't find any courses matching your filters. Try adjusting your search or clearing filters.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear all filters
                </Button>
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
