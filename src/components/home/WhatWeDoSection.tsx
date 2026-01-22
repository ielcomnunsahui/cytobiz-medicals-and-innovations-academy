import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Lightbulb, Target, Layers } from "lucide-react";

export function WhatWeDoSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-background relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/[0.02] to-transparent" />
      
      <div className="container-wide relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Text Content */}
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-primary font-medium mb-4 text-sm uppercase tracking-widest"
            >
              What We Do
            </motion.p>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight"
            >
              Bridging Theory and
              <br />
              <span className="text-primary">Real-World Practice</span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted-foreground leading-relaxed mb-8"
            >
              We deliver hands-on, outcome-driven courses that bridge the gap between 
              theory and real-world healthcare practice through structured learning 
              and guided projects.
            </motion.p>

            {/* Key Points */}
            <div className="space-y-4">
              {[
                { icon: Target, text: "Practical, case-based learning" },
                { icon: Layers, text: "Real healthcare and public health problems" },
                { icon: Lightbulb, text: "Innovation and project-driven approach" },
              ].map((item, index) => (
                <motion.div
                  key={item.text}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="flex items-center gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right - Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Animated concentric circles */}
              {[1, 2, 3].map((ring) => (
                <motion.div
                  key={ring}
                  className="absolute inset-0 rounded-full border border-primary/10"
                  style={{ 
                    top: `${ring * 12}%`, 
                    left: `${ring * 12}%`, 
                    right: `${ring * 12}%`, 
                    bottom: `${ring * 12}%` 
                  }}
                  animate={{ 
                    scale: [1, 1.05, 1],
                    opacity: [0.3, 0.6, 0.3] 
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    delay: ring * 0.5 
                  }}
                />
              ))}
              
              {/* Center content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className="w-40 h-40 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-glow"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                >
                  <motion.div
                    animate={{ rotate: [360, 0] }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="text-center"
                  >
                    <span className="text-4xl font-display font-bold text-primary-foreground">CA</span>
                  </motion.div>
                </motion.div>
              </div>

              {/* Floating skill badges */}
              {[
                { label: "Healthcare", angle: 0 },
                { label: "Innovation", angle: 90 },
                { label: "Technology", angle: 180 },
                { label: "Research", angle: 270 },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  className="absolute"
                  style={{
                    top: `${50 + 45 * Math.sin((item.angle * Math.PI) / 180)}%`,
                    left: `${50 + 45 * Math.cos((item.angle * Math.PI) / 180)}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.15 }}
                >
                  <motion.div
                    className="px-4 py-2 bg-card border border-border rounded-full shadow-md whitespace-nowrap text-sm font-medium text-foreground"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.4 }}
                  >
                    {item.label}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
