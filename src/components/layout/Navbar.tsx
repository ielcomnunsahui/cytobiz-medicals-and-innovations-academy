import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown, LogOut, LayoutDashboard, Settings, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";
import logoIcon from "@/assets/logo-icon.png";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/courses" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoading, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const getUserInitials = () => {
    if (!user?.email) return "U";
    return user.email[0].toUpperCase();
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "bg-card/95 backdrop-blur-lg border-b border-border shadow-sm" : "bg-transparent",
        )}
      >
        <div className="container-wide">
          <nav className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <img src={logoIcon} alt="Cytobiz Logo" className="h-10 w-10 object-contain" />
              <div className="flex flex-col">
                <span
                  className={cn(
                    "font-display font-bold text-lg leading-tight transition-colors",
                    isScrolled ? "text-primary" : "text-primary-foreground",
                  )}
                >
                  CYTOBIZ
                </span>
                <span
                  className={cn(
                    "text-xs font-medium leading-tight transition-colors hidden sm:block",
                    isScrolled ? "text-muted-foreground" : "text-primary-foreground/70",
                  )}
                >
                  Medical Academy
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    location.pathname === link.href
                      ? isScrolled
                        ? "text-primary bg-primary/10"
                        : "text-primary-foreground bg-white/10"
                      : isScrolled
                        ? "text-muted-foreground hover:text-foreground hover:bg-muted"
                        : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10",
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Desktop CTA / User Menu */}
            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle />
              {isLoading ? (
                <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={cn(
                        "flex items-center gap-2 px-2",
                        isScrolled ? "text-foreground hover:bg-muted" : "text-primary-foreground hover:bg-white/10",
                      )}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.email}</p>
                      <p className="text-xs text-muted-foreground">{isAdmin ? "Administrator" : "Learner"}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/my-enrollments" className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        My Enrollments
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="flex items-center gap-2">
                          <Settings className="w-4 h-4" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    asChild
                    className={cn(
                      "transition-colors",
                      isScrolled ? "text-foreground hover:bg-muted" : "text-primary-foreground hover:bg-white/10",
                    )}
                  >
                    <Link to="/login">Sign In</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all"
                  >
                    <Link to="/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "md:hidden p-2 rounded-lg transition-colors",
                isScrolled ? "text-foreground hover:bg-muted" : "text-primary-foreground hover:bg-white/10",
              )}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/95 backdrop-blur-lg pt-20"
            >
              <nav className="container-wide py-8 flex flex-col gap-2">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.href}
                      className={cn(
                        "block px-4 py-3 text-lg font-medium rounded-xl transition-colors",
                        location.pathname === link.href
                          ? "text-primary bg-primary/10"
                          : "text-foreground hover:bg-muted",
                      )}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}

                {user && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link
                      to="/dashboard"
                      className="block px-4 py-3 text-lg font-medium rounded-xl text-foreground hover:bg-muted"
                    >
                      Dashboard
                    </Link>
                  </motion.div>
                )}

                {isAdmin && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Link
                      to="/admin"
                      className="block px-4 py-3 text-lg font-medium rounded-xl text-foreground hover:bg-muted"
                    >
                      Admin Panel
                    </Link>
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="pt-4 flex flex-col gap-3"
                >
                  {user ? (
                    <Button variant="outline" size="lg" className="w-full" onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  ) : (
                    <>
                      <Button variant="outline" size="lg" className="w-full" asChild>
                        <Link to="/login">Sign In</Link>
                      </Button>
                      <Button size="lg" className="w-full bg-primary hover:bg-primary/90" asChild>
                        <Link to="/signup">Get Started</Link>
                      </Button>
                    </>
                  )}
                </motion.div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
