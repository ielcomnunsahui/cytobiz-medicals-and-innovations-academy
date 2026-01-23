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
  Filter,
  GraduationCap,
  TrendingUp,
  Star,
  Heart,
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
import { TestimonialsCarousel } from "@/components/courses/TestimonialsCarousel";
import { useWishlist } from "@/hooks/useWishlist";

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

const quickFilters = [
  { label: "Popular", icon: TrendingUp },
  { label: "New", icon: Sparkles },
  { label: "Certificate", icon: Award },
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
  const { isInWishlist, toggleWishlist } = useWishlist();

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
        <section className="relative min-h-[50vh] flex items-center overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background dark:from-background dark:via-primary/10 dark:to-background">
            <motion.div 
              className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-primary/20 dark:bg-primary/30 blur-[120px]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-0 left-1/4 w-[500px] h-[500px] rounded-full bg-accent/15 dark:bg-accent/25 blur-[100px]"
              animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.2, 0.4] }}
              transition={{ duration: 12, repeat: Infinity }}
            />
            
            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
          </div>

          <div className="container-wide relative z-10 py-16">
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 mb-8"
              >
                <GraduationCap className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  {isLoading ? "Loading..." : `${courses?.length || 0} Courses Available`}
                </span>
              </motion.div>

              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-[1.1]">
                Build Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-accent block">
                  Healthcare Career
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-2xl mb-10">
                Discover expert-led courses in medical education, public health, 
                healthcare innovation, and digital health.
              </p>

              {/* Quick Filters */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-3"
              >
                {quickFilters.map((filter, index) => (
                  <motion.button
                    key={filter.label}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card dark:bg-card/80 border border-border hover:border-primary/50 text-sm font-medium text-foreground transition-all"
                  >
                    <filter.icon className="w-4 h-4 text-primary" />
                    {filter.label}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Search & Filters Bar */}
        <section className="sticky top-16 md:top-20 z-30 bg-background/95 dark:bg-background/95 backdrop-blur-xl border-b border-border py-5 shadow-sm">
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
                  className="pl-12 h-12 bg-card dark:bg-card/80 border-2 border-border focus:border-primary transition-colors"
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
                  <SelectTrigger className="w-52 h-12 bg-card dark:bg-card/80 border-2">
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
                  <SelectTrigger className="w-44 h-12 bg-card dark:bg-card/80 border-2">
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
                className="md:hidden h-12 border-2 bg-card dark:bg-card/80"
              >
                <Filter className="w-4 h-4 mr-2" />
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
                      <SelectTrigger className="bg-card dark:bg-card/80 h-12 border-2">
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
                      <SelectTrigger className="bg-card dark:bg-card/80 h-12 border-2">
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
                  <div key={index} className="bg-card dark:bg-card/80 rounded-2xl overflow-hidden border border-border">
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
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      whileHover={{ y: -8, transition: { duration: 0.3 } }}
                      className="group relative"
                    >
                      {/* Wishlist Button */}
                      <motion.button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(course.id);
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={cn(
                          "absolute top-4 right-4 z-20 w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center transition-all shadow-lg",
                          isInWishlist(course.id)
                            ? "bg-destructive text-destructive-foreground"
                            : "bg-background/20 text-white hover:bg-background/40"
                        )}
                        aria-label={isInWishlist(course.id) ? "Remove from wishlist" : "Add to wishlist"}
                      >
                        <Heart className={cn("w-5 h-5", isInWishlist(course.id) && "fill-current")} />
                      </motion.button>

                      <Link
                        to={`/courses/${course.slug}`}
                        className="flex flex-col h-full bg-card dark:bg-card/80 rounded-2xl overflow-hidden border border-border hover:border-primary/50 hover:shadow-2xl transition-all duration-500"
                      >
                        {/* Image */}
                        <div className="relative aspect-[16/10] bg-gradient-to-br from-primary via-primary/80 to-accent overflow-hidden">
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
                                "backdrop-blur-sm shadow-lg",
                                course.course_type === "cohort"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-gold text-foreground"
                              )}
                            >
                              {course.course_type === "cohort" ? "Cohort" : "Self-Paced"}
                            </Badge>
                          </div>
                          
                          {/* Price */}
                          <div className="absolute bottom-4 right-4">
                            <span className="px-4 py-2 rounded-full bg-card/95 dark:bg-card/90 backdrop-blur-md text-lg font-bold text-foreground shadow-lg">
                              {course.price ? `₦${course.price.toLocaleString()}` : "Free"}
                            </span>
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
                              className="text-sm font-semibold text-primary inline-flex items-center gap-1 group-hover:gap-2 transition-all"
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted/50 dark:bg-muted/30 flex items-center justify-center">
                  <BookOpen className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-3">
                  No courses found
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We couldn't find any courses matching your filters. Try adjusting your search or clearing filters.
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear all filters
                </Button>
              </motion.div>
            )}
          </div>
        </section>

        {/* Testimonials Carousel */}
        <TestimonialsCarousel />

        {/* CTA Section */}
        <section className="section-padding">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-accent" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySHI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
              
              <div className="relative px-8 py-16 md:py-20 text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 mb-6"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Start Your Learning Journey</span>
                </motion.div>
                
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
                  Can't find what you're looking for?
                </h2>
                <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                  Let us know what topics interest you and we'll help you find the perfect course.
                </p>
                <Button
                  size="lg"
                  asChild
                  className="bg-white text-primary hover:bg-white/90 shadow-xl"
                >
                  <Link to="/contact">
                    Get in Touch
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;
