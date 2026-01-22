import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const learningAreas = [
  {
    title: "Medical & Clinical Capacity Building",
    description: "Strengthen clinical skills and medical knowledge",
    icon: "🏥",
    color: "from-blue-500/20 to-blue-600/5",
    hoverColor: "group-hover:border-blue-500/40",
  },
  {
    title: "Public Health & Health Systems",
    description: "Population health and system strengthening",
    icon: "🌍",
    color: "from-emerald-500/20 to-emerald-600/5",
    hoverColor: "group-hover:border-emerald-500/40",
  },
  {
    title: "Healthcare Innovation & Entrepreneurship",
    description: "Build and scale health solutions",
    icon: "🚀",
    color: "from-purple-500/20 to-purple-600/5",
    hoverColor: "group-hover:border-purple-500/40",
  },
  {
    title: "AI & Digital Health",
    description: "Leverage technology in healthcare",
    icon: "🤖",
    color: "from-cyan-500/20 to-cyan-600/5",
    hoverColor: "group-hover:border-cyan-500/40",
  },
  {
    title: "Technology & Innovation",
    description: "Cutting-edge health technologies",
    icon: "💡",
    color: "from-amber-500/20 to-amber-600/5",
    hoverColor: "group-hover:border-amber-500/40",
  },
  {
    title: "Research & Project Management in Health",
    description: "Evidence-based practice and leadership",
    icon: "📊",
    color: "from-rose-500/20 to-rose-600/5",
    hoverColor: "group-hover:border-rose-500/40",
  },
];

export function LearningAreasSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-background">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <p className="text-primary font-medium mb-4 text-sm uppercase tracking-widest">
            Explore by Specialty
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6">
            Learning Areas
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover courses across key domains in healthcare and innovation
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {learningAreas.map((area, index) => (
            <motion.div
              key={area.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08 }}
            >
              <Link
                to={`/courses?area=${encodeURIComponent(area.title.toLowerCase().replace(/\s+/g, '-'))}`}
                className="group block h-full"
              >
                <motion.div
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`relative p-6 rounded-2xl bg-gradient-to-br ${area.color} border border-border ${area.hoverColor} transition-colors duration-300 h-full overflow-hidden`}
                >
                  {/* Decorative circles */}
                  <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                      <motion.span 
                        className="text-4xl"
                        animate={isInView ? { scale: [0.8, 1] } : {}}
                        transition={{ delay: index * 0.1, type: "spring" }}
                      >
                        {area.icon}
                      </motion.span>
                      <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    
                    <h3 className="font-display font-semibold text-lg text-foreground mb-2 group-hover:text-primary transition-colors leading-tight">
                      {area.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {area.description}
                    </p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
