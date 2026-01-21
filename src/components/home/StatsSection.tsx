import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, BookOpen, Award, Globe } from "lucide-react";
import { useSiteStats } from "@/hooks/useSiteSettings";

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { data: stats, isLoading } = useSiteStats();

  const statItems = [
    {
      icon: Users,
      value: stats?.learnerCount ?? "—",
      label: "Active Learners",
      description: "Healthcare professionals worldwide",
    },
    {
      icon: Globe,
      value: stats?.countriesCount ?? "—",
      label: "Countries",
      description: "Global community reach",
    },
    {
      icon: BookOpen,
      value: stats?.programsCount ?? "—",
      label: "Programs",
      description: "Across 8 practice areas",
    },
    {
      icon: Award,
      value: stats?.completionRate ?? "—",
      label: "Completion Rate",
      description: "Industry-leading success",
    },
  ];

  return (
    <section ref={ref} className="py-16 bg-background border-y border-border">
      <div className="container-wide">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {statItems.map((stat, index) => (
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
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4"
              >
                <stat.icon className="w-6 h-6 text-primary" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
              >
                {isLoading ? (
                  <div className="h-10 w-20 bg-muted animate-pulse rounded mx-auto mb-1" />
                ) : (
                  <div className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                )}
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
