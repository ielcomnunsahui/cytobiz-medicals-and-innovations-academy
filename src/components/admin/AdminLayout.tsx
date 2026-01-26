import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  GraduationCap,
  Award,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Bell,
  ClipboardCheck,
  Quote,
  Tag,
  Star,
  BarChart3,
  Shield,
  Unlock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import logoIcon from "@/assets/logo-icon.png";

const adminNavItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Courses", href: "/admin/courses", icon: BookOpen },
  { name: "Cohorts", href: "/admin/cohorts", icon: Users },
  { name: "Facilitators", href: "/admin/facilitators", icon: GraduationCap },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Enrollments", href: "/admin/enrollments", icon: GraduationCap },
  { name: "Enrollment Review", href: "/admin/enrollment-review", icon: ClipboardCheck, showPendingBadge: true },
  { name: "Discount Codes", href: "/admin/discount-codes", icon: Tag },
  { name: "Reviews", href: "/admin/reviews", icon: Star },
  { name: "Success Stories", href: "/admin/success-stories", icon: Quote },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Certificates", href: "/admin/certificates", icon: Award },
  { name: "Access Control", href: "/admin/access-settings", icon: Shield },
  { name: "Access Unlocks", href: "/admin/access-unlocks", icon: Unlock },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  // Fetch admin stats for sidebar
  const { data: stats } = useQuery({
    queryKey: ["admin-sidebar-stats"],
    queryFn: async () => {
      const [
        { count: pendingEnrollments },
        { count: totalUsers },
        { count: activeEnrollments },
        { data: revenueData }
      ] = await Promise.all([
        supabase.from("enrollments").select("*", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("enrollments").select("*", { count: "exact", head: true }).eq("status", "confirmed"),
        supabase.from("enrollments").select("payment_amount").eq("status", "confirmed")
      ]);
      
      const totalRevenue = revenueData?.reduce((sum, e) => sum + (e.payment_amount || 0), 0) || 0;
      
      return {
        pendingEnrollments: pendingEnrollments || 0,
        totalUsers: totalUsers || 0,
        activeEnrollments: activeEnrollments || 0,
        totalRevenue
      };
    },
    refetchInterval: 30000,
  });

  const pendingCount = stats?.pendingEnrollments || 0;

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-sidebar text-sidebar-foreground transform transition-transform lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-sidebar-border">
            <img src={logoIcon} alt="Cytobiz" className="w-10 h-10" />
            <div>
              <span className="font-bold text-lg">Cytobiz</span>
              <span className="text-xs block text-sidebar-foreground/70">Admin Panel</span>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="px-4 py-3 border-b border-sidebar-border bg-sidebar-accent/30">
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-sidebar-accent/50 rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-sidebar-foreground">{stats?.totalUsers?.toLocaleString() || 0}</div>
                <div className="text-xs text-sidebar-foreground/60">Users</div>
              </div>
              <div className="bg-sidebar-accent/50 rounded-lg p-2 text-center">
                <div className="text-lg font-bold text-sidebar-foreground">{stats?.activeEnrollments?.toLocaleString() || 0}</div>
                <div className="text-xs text-sidebar-foreground/60">Active</div>
              </div>
              <div className="bg-sidebar-accent/50 rounded-lg p-2 text-center relative">
                <div className="text-lg font-bold text-sidebar-foreground">{pendingCount}</div>
                <div className="text-xs text-sidebar-foreground/60">Pending</div>
                {pendingCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full animate-pulse" />
                )}
              </div>
              <div className="bg-sidebar-accent/50 rounded-lg p-2 text-center">
                <div className="text-sm font-bold text-sidebar-foreground">₦{((stats?.totalRevenue || 0) / 1000).toFixed(0)}k</div>
                <div className="text-xs text-sidebar-foreground/60">Revenue</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {/* Quick Links */}
            <div className="mb-4 pb-4 border-b border-sidebar-border space-y-1">
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Back to Home
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                User Dashboard
              </Link>
            </div>

            {adminNavItems.map((item) => {
              const isActive = location.pathname === item.href;
              const showBadge = (item as any).showPendingBadge && pendingCount > 0;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1">{item.name}</span>
                  {showBadge && (
                    <Badge variant="destructive" className="h-5 min-w-5 px-1.5 text-xs">
                      {pendingCount}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-sidebar-border">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background border-b border-border">
          <div className="flex items-center justify-between px-4 lg:px-8 h-16">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center gap-4 ml-auto">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.email?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:block">{user?.email}</span>
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link to="/admin/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
