import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Search, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTransition } from "@/components/PageTransition";
import logoIcon from "@/assets/logo-icon.png";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-background">
        {/* Header */}
        <header className="p-6">
          <Link to="/" className="inline-flex items-center gap-3">
            <img src={logoIcon} alt="Cytobiz Academy" className="h-10" />
            <span className="text-xl font-bold text-foreground">Cytobiz Academy</span>
          </Link>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-2xl mx-auto text-center">
            {/* Animated 404 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative mb-8"
            >
              <motion.h1 
                className="text-[150px] sm:text-[200px] font-bold text-primary/10 leading-none select-none"
                animate={{ 
                  textShadow: [
                    "0 0 20px hsl(var(--primary) / 0.1)",
                    "0 0 40px hsl(var(--primary) / 0.2)",
                    "0 0 20px hsl(var(--primary) / 0.1)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                404
              </motion.h1>
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Search className="w-16 h-16 sm:w-24 sm:h-24 text-primary" />
              </motion.div>
            </motion.div>

            {/* Message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                Page Not Found
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                Oops! The page you're looking for doesn't exist or has been moved. 
                Let's get you back on track.
              </p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button asChild size="lg" className="gap-2">
                <Link to="/">
                  <Home className="w-5 h-5" />
                  Go to Homepage
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link to="/courses">
                  <BookOpen className="w-5 h-5" />
                  Browse Courses
                </Link>
              </Button>
            </motion.div>

            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8"
            >
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Go back to previous page
              </button>
            </motion.div>

            {/* Helpful Links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-12 pt-8 border-t border-border"
            >
              <p className="text-sm text-muted-foreground mb-4">
                Looking for something specific?
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link 
                  to="/about" 
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  About Us
                </Link>
                <Link 
                  to="/contact" 
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Contact Support
                </Link>
                <Link 
                  to="/login" 
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Cytobiz Medical Academy. All rights reserved.
          </p>
        </footer>
      </div>
    </PageTransition>
  );
};

export default NotFound;
