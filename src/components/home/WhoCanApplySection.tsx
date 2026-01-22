import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Stethoscope, Heart, Globe, FlaskConical, Lightbulb, GraduationCap, CheckCircle } from "lucide-react";

const audiences = [
  { icon: GraduationCap, label: "Medical & Health Students" },
  { icon: Stethoscope, label: "Healthcare Professionals" },
  { icon: Globe, label: "Public Health Practitioners" },
  { icon: FlaskConical, label: "Researchers" },
  { icon: Lightbulb, label: "Innovators & Entrepreneurs" },
  { icon: Heart, label: "Early-Career Professionals" },
];

export function WhoCanApplySection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container-wide relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              className="text-primary font-medium mb-4 text-sm uppercase tracking-widest"
            >
              Who Can Apply
            </motion.p>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight"
            >
              Designed for Those
              <br />
              <span className="text-primary">Ready to Lead</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground mb-8 leading-relaxed"
            >
              Whether you're starting your healthcare career or looking to advance, 
              our programs are designed to help you become healthcare career-ready.
            </motion.p>

            {/* Features */}
            <div className="space-y-4">
              {[
                "Job-relevant, practical skills",
                "Applied projects and real-world experience",
                "Strong learning community and alumni network",
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right - Audience Cards */}
          <div className="grid grid-cols-2 gap-4">
            {audiences.map((audience, index) => (
              <motion.div
                key={audience.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="group"
              >
                <div className="bg-card border border-border rounded-2xl p-5 h-full hover:border-primary/30 hover:shadow-lg transition-all duration-300">
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.4 }}
                  >
                    <audience.icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <span className="font-medium text-foreground text-sm leading-snug block">
                    {audience.label}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
