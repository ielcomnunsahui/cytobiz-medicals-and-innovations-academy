import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminLayout } from "@/components/admin/AdminLayout";

const stats = [
  {
    title: "Total Users",
    value: "2,451",
    change: "+12.5%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Active Courses",
    value: "48",
    change: "+4",
    trend: "up",
    icon: BookOpen,
  },
  {
    title: "Revenue",
    value: "$124,500",
    change: "+8.2%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Completion Rate",
    value: "94.5%",
    change: "-2.1%",
    trend: "down",
    icon: TrendingUp,
  },
];

const recentEnrollments = [
  { user: "Dr. Sarah Chen", course: "Digital Health Innovation", date: "2 hours ago" },
  { user: "Michael Johnson", course: "Public Health Analytics", date: "4 hours ago" },
  { user: "Dr. Elena Rodriguez", course: "Healthcare AI", date: "6 hours ago" },
  { user: "James Wilson", course: "Medical Research Methods", date: "8 hours ago" },
  { user: "Dr. Aisha Patel", course: "Telemedicine Excellence", date: "12 hours ago" },
];

export default function AdminDashboard() {
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
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="w-5 h-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div
                    className={`flex items-center text-sm ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                    {stat.change} from last month
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Enrollments */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Enrollments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEnrollments.map((enrollment, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-medium">{enrollment.user}</p>
                      <p className="text-sm text-muted-foreground">{enrollment.course}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{enrollment.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full p-4 text-left rounded-lg border border-border hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Create New Course</p>
                    <p className="text-sm text-muted-foreground">Add a new course to the catalog</p>
                  </div>
                </div>
              </button>
              <button className="w-full p-4 text-left rounded-lg border border-border hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Manage Users</p>
                    <p className="text-sm text-muted-foreground">View and manage user accounts</p>
                  </div>
                </div>
              </button>
              <button className="w-full p-4 text-left rounded-lg border border-border hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">View Reports</p>
                    <p className="text-sm text-muted-foreground">Access analytics and reports</p>
                  </div>
                </div>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
