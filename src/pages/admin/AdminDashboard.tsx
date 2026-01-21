import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users,
  BookOpen,
  GraduationCap,
  Award,
  ArrowUpRight,
  Plus,
  Settings,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAdminStats, useRecentEnrollments } from "@/hooks/useAdminData";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: recentEnrollments, isLoading: enrollmentsLoading } = useRecentEnrollments(5);

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      href: "/admin/users",
      color: "bg-blue-500",
    },
    {
      title: "Published Courses",
      value: stats?.publishedCourses || 0,
      icon: BookOpen,
      href: "/admin/courses",
      color: "bg-emerald-500",
    },
    {
      title: "Enrollments",
      value: stats?.totalEnrollments || 0,
      icon: GraduationCap,
      href: "/admin/enrollments",
      color: "bg-purple-500",
    },
    {
      title: "Certificates",
      value: stats?.totalCertificates || 0,
      icon: Award,
      href: "/admin/certificates",
      color: "bg-amber-500",
    },
  ];

  const quickActions = [
    {
      title: "Create New Course",
      description: "Add a new course to the catalog",
      icon: Plus,
      href: "/admin/courses",
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Manage Users",
      description: "View and manage user accounts",
      icon: Users,
      href: "/admin/users",
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      title: "View Enrollments",
      description: "See all course enrollments",
      icon: GraduationCap,
      href: "/admin/enrollments",
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Site Settings",
      description: "Configure site-wide settings",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-amber-100 text-amber-600",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your academy.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={stat.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5 text-white" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    {statsLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="text-3xl font-bold">{stat.value.toLocaleString()}</div>
                        <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Enrollments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Enrollments</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/admin/enrollments">View All</Link>
              </Button>
            </CardHeader>
            <CardContent>
              {enrollmentsLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                      <Skeleton className="h-3 w-20" />
                    </div>
                  ))}
                </div>
              ) : recentEnrollments?.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No enrollments yet
                </p>
              ) : (
                <div className="space-y-4">
                  {recentEnrollments?.map((enrollment: any) => (
                    <div
                      key={enrollment.id}
                      className="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                      <div>
                        <p className="font-medium">
                          {enrollment.profile?.display_name || "Unknown User"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {enrollment.course?.title || "Unknown Course"}
                        </p>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(enrollment.enrolled_at), { addSuffix: true })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickActions.map((action) => (
                <Link key={action.title} to={action.href}>
                  <button className="w-full p-4 text-left rounded-lg border border-border hover:bg-muted transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center`}>
                        <action.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{action.title}</p>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </button>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
