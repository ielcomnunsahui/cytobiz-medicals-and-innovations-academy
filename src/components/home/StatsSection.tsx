import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, BookOpen, Award, Globe } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "10,000+",
    label: "Active Learners",
    description: "From 50+ countries",
  },
  {
    icon: BookOpen,
    value: "50+",
    label: "Expert-Led Courses",
    description: "Across 8 domains",
  },
  {
    icon: Award,
    value: "98%",
    label: "Completion Rate",
    description: "Industry-leading success",
  },
  {
    icon: Globe,
    value: "150+",
    label: "Partner Organizations",
    description: "Global network",
  },
];

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 bg-background border-y border-border">
      <div className="container-wide">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: "spring" }}
                className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4"
              >
                <stat.icon className="w-7 h-7 text-primary" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="font-medium text-foreground mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
