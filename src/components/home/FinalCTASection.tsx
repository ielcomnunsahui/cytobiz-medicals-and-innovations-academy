import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function FinalCTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          animate={{
            background: [
              "radial-gradient(circle, hsl(var(--primary) / 0.05) 0%, transparent 70%)",
              "radial-gradient(circle, hsl(var(--primary) / 0.1) 0%, transparent 70%)",
              "radial-gradient(circle, hsl(var(--primary) / 0.05) 0%, transparent 70%)",
            ]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
      </div>

      <div className="container-wide relative">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Ready to Get Started?
            </span>
          </motion.div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight">
            Join the Next Learning
            <br />
            <span className="text-primary">Experience Designed for Impact</span>
          </h2>

          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Explore our available courses and take the first step toward 
            building the skills that matter in healthcare.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                asChild
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl h-16 px-12 text-lg font-semibold group"
              >
                <Link to="/courses">
                  View Courses
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </Button>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="h-16 px-12 text-lg font-semibold border-2"
              >
                <Link to="/signup">Register Now</Link>
              </Button>
            </motion.div>
          </div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="mt-14 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground"
          >
            {[
              "No prior experience required",
              "Flexible payment options",
              "Lifetime certificate access"
            ].map((item, index) => (
              <motion.div 
                key={item}
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 + index * 0.1 }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-success" />
                {item}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
