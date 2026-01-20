import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Award,
  Clock,
  ArrowRight,
  Play,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";

// Mock data - will be replaced with Supabase query
const enrolledCourses = [
  {
    id: "1",
    title: "Digital Health Innovation Leadership",
    thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop",
    progress: 65,
    nextLesson: "Building the Business Case",
    type: "cohort",
    dueDate: "Jan 25, 2026",
  },
  {
    id: "2",
    title: "Public Health Data Analytics",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    progress: 30,
    nextLesson: "Data Visualization Techniques",
    type: "self_paced",
    dueDate: null,
  },
];

const certificates = [
  {
    id: "1",
    course: "Healthcare Communication",
    issuedAt: "Dec 15, 2025",
    verificationCode: "CYT-2025-12345",
  },
];

const upcomingSessions = [
  {
    title: "Leadership Q&A with Dr. Martinez",
    course: "Digital Health Innovation",
    date: "Jan 22, 2026",
    time: "6:00 PM EST",
  },
];

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container-wide">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Welcome back!
            </h1>
            <p className="text-muted-foreground">
              Continue your learning journey where you left off.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Continue Learning */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">
                    Continue Learning
                  </h2>
                  <Link
                    to="/my-courses"
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    View all courses
                  </Link>
                </div>

                <div className="space-y-4">
                  {enrolledCourses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-48 h-32 sm:h-auto relative flex-shrink-0">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card sm:from-transparent sm:to-card" />
                        </div>

                        <div className="flex-1 p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <Badge variant="outline" className="mb-2 capitalize">
                                {course.type.replace("_", "-")}
                              </Badge>
                              <h3 className="font-semibold text-card-foreground">
                                {course.title}
                              </h3>
                            </div>
                            {course.dueDate && (
                              <span className="text-sm text-muted-foreground">
                                Due: {course.dueDate}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                            <Play className="w-4 h-4" />
                            Next: {course.nextLesson}
                          </div>

                          <div className="flex items-center gap-4">
                            <Progress value={course.progress} className="flex-1 h-2" />
                            <span className="text-sm font-medium text-muted-foreground">
                              {course.progress}%
                            </span>
                          </div>

                          <Button
                            size="sm"
                            className="mt-4 bg-primary hover:bg-primary/90"
                            asChild
                          >
                            <Link to={`/learn/${course.id}`}>
                              Continue
                              <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Certificates */}
              {certificates.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-foreground mb-6">
                    Your Certificates
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {certificates.map((cert) => (
                      <div
                        key={cert.id}
                        className="bg-card border border-border rounded-2xl p-5"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Award className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-card-foreground">
                              {cert.course}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              Issued on {cert.issuedAt}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <CheckCircle className="w-3 h-3 text-green-500" />
                              {cert.verificationCode}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-4">
                          View Certificate
                        </Button>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Stats */}
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-semibold text-card-foreground mb-4">
                  Your Progress
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{enrolledCourses.length}</p>
                      <p className="text-sm text-muted-foreground">Active Courses</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Award className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{certificates.length}</p>
                      <p className="text-sm text-muted-foreground">Certificates Earned</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">24</p>
                      <p className="text-sm text-muted-foreground">Hours Learned</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming Sessions */}
              {upcomingSessions.length > 0 && (
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-semibold text-card-foreground mb-4">
                    Upcoming Sessions
                  </h3>
                  <div className="space-y-4">
                    {upcomingSessions.map((session, index) => (
                      <div key={index} className="border-l-2 border-primary pl-4">
                        <p className="font-medium text-card-foreground">
                          {session.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {session.course}
                        </p>
                        <p className="text-sm text-primary mt-1">
                          {session.date} at {session.time}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Browse Courses CTA */}
              <div className="bg-hero-gradient rounded-2xl p-6 text-primary-foreground">
                <h3 className="font-semibold mb-2">Explore More Courses</h3>
                <p className="text-sm text-primary-foreground/80 mb-4">
                  Discover new skills and advance your healthcare career.
                </p>
                <Button
                  asChild
                  variant="secondary"
                  className="w-full bg-white text-primary hover:bg-white/90"
                >
                  <Link to="/courses">Browse Catalog</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
