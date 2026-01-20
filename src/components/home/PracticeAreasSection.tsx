import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

// Using authoritative medical language
const practiceAreas = [
  {
    name: "Digital Health & Technology",
    icon: "🏥",
    description: "Digital transformation, telemedicine, health IT systems",
    courses: 12,
    color: "from-primary/20 to-primary/5",
    borderColor: "hover:border-primary/40",
  },
  {
    name: "Public Health & Epidemiology",
    icon: "🌍",
    description: "Population health, disease prevention, health policy",
    courses: 10,
    color: "from-emerald-500/20 to-emerald-500/5",
    borderColor: "hover:border-emerald-500/40",
  },
  {
    name: "Clinical Leadership",
    icon: "👥",
    description: "Healthcare management, team leadership, quality improvement",
    courses: 8,
    color: "from-purple-500/20 to-purple-500/5",
    borderColor: "hover:border-purple-500/40",
  },
  {
    name: "Research Methodology",
    icon: "🔬",
    description: "Clinical trials, evidence-based practice, biostatistics",
    courses: 7,
    color: "from-amber-500/20 to-amber-500/5",
    borderColor: "hover:border-amber-500/40",
  },
  {
    name: "Health Data Analytics",
    icon: "📊",
    description: "Healthcare analytics, data visualization, decision support",
    courses: 6,
    color: "from-blue-500/20 to-blue-500/5",
    borderColor: "hover:border-blue-500/40",
  },
  {
    name: "Healthcare Innovation",
    icon: "💡",
    description: "Medical devices, AI in healthcare, entrepreneurship",
    courses: 9,
    color: "from-rose-500/20 to-rose-500/5",
    borderColor: "hover:border-rose-500/40",
  },
];

export function PracticeAreasSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <p className="text-primary font-medium mb-3 text-sm uppercase tracking-wider">
            Explore by Specialty
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Practice Areas
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse courses organized by clinical and professional domains
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {practiceAreas.map((area, index) => (
            <motion.div
              key={area.name}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <Link
                to={`/courses?area=${encodeURIComponent(area.name.toLowerCase().replace(/\s+/g, '-'))}`}
                className="group block"
              >
                <div
                  className={`relative p-6 rounded-2xl bg-gradient-to-br ${area.color} border border-border ${area.borderColor} transition-all duration-300 hover:shadow-lg overflow-hidden`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-white/20" />
                  </div>

                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-3xl">{area.icon}</span>
                      <ArrowRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </div>
                    
                    <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {area.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {area.description}
                    </p>
                    <p className="text-sm font-medium text-primary">
                      {area.courses} courses available
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
