import { motion } from "framer-motion";
import { 
  Heart, 
  Microscope, 
  Globe2, 
  Cpu, 
  Stethoscope,
  Brain,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const learningAreas = [
  {
    id: "clinical",
    title: "Clinical Medicine",
    description: "Evidence-based clinical practice, diagnostics, and patient care excellence.",
    icon: Stethoscope,
    courses: 12,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    hoverBorder: "hover:border-rose-200",
  },
  {
    id: "public-health",
    title: "Public Health",
    description: "Population health, epidemiology, health policy, and global health initiatives.",
    icon: Globe2,
    courses: 8,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    hoverBorder: "hover:border-blue-200",
  },
  {
    id: "digital-health",
    title: "Digital Health",
    description: "Health tech innovation, telemedicine, AI in healthcare, and digital therapeutics.",
    icon: Cpu,
    courses: 15,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    hoverBorder: "hover:border-secondary/30",
  },
  {
    id: "research",
    title: "Medical Research",
    description: "Research methodology, clinical trials, data analysis, and scientific writing.",
    icon: Microscope,
    courses: 6,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    hoverBorder: "hover:border-purple-200",
  },
  {
    id: "wellness",
    title: "Health & Wellness",
    description: "Preventive medicine, nutrition, mental health, and lifestyle medicine.",
    icon: Heart,
    courses: 10,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    hoverBorder: "hover:border-pink-200",
  },
  {
    id: "innovation",
    title: "Healthcare Innovation",
    description: "Medical entrepreneurship, health startups, and innovation management.",
    icon: Brain,
    courses: 7,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    hoverBorder: "hover:border-amber-200",
  },
];

export function LearningAreasSection() {
  return (
    <section className="section-padding bg-muted/50">
      <div className="container-wide">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12 md:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 text-secondary text-sm font-medium mb-4">
            Learning Areas
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Explore Our Disciplines
          </h2>
          <p className="text-muted-foreground text-lg">
            From clinical excellence to digital innovation, discover courses designed 
            by experts to advance your healthcare career.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningAreas.map((area, index) => (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={`/courses?area=${area.id}`}
                className={cn(
                  "group flex flex-col h-full p-6 rounded-2xl bg-card border-2 border-transparent",
                  "transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
                  area.hoverBorder
                )}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={cn("p-3 rounded-xl", area.bgColor)}>
                    <area.icon className={cn("w-6 h-6", area.color)} />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {area.courses} courses
                  </span>
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2 group-hover:text-secondary transition-colors">
                  {area.title}
                </h3>
                <p className="text-muted-foreground text-sm flex-1">
                  {area.description}
                </p>
                <div className="flex items-center gap-2 mt-4 text-sm font-medium text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                  View courses
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
