import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const topics = [
  {
    name: "Technology & Innovation",
    icon: "💻",
    courses: 12,
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    name: "Leadership & Communication",
    icon: "🎯",
    courses: 8,
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    name: "Health Care",
    icon: "🏥",
    courses: 15,
    color: "from-red-500/20 to-orange-500/20",
  },
  {
    name: "Public Health",
    icon: "🌍",
    courses: 10,
    color: "from-green-500/20 to-teal-500/20",
  },
  {
    name: "Digital Health",
    icon: "📱",
    courses: 9,
    color: "from-indigo-500/20 to-violet-500/20",
  },
  {
    name: "Research Methods",
    icon: "🔬",
    courses: 7,
    color: "from-amber-500/20 to-yellow-500/20",
  },
  {
    name: "Data Analytics",
    icon: "📊",
    courses: 6,
    color: "from-emerald-500/20 to-lime-500/20",
  },
  {
    name: "Medical Education",
    icon: "📚",
    courses: 11,
    color: "from-rose-500/20 to-pink-500/20",
  },
];

export function TopicsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-muted/30">
      <div className="container-wide">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Explore Topics
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover courses across essential healthcare and innovation domains
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {topics.map((topic, index) => (
            <motion.div
              key={topic.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Link
                to={`/courses?category=${encodeURIComponent(topic.name)}`}
                className="group block"
              >
                <div
                  className={`relative p-6 rounded-2xl bg-gradient-to-br ${topic.color} border border-border hover:border-primary/30 transition-all hover:shadow-lg overflow-hidden`}
                >
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/20 -translate-y-1/2 translate-x-1/2" />
                  </div>

                  <div className="relative">
                    <span className="text-4xl mb-4 block">{topic.icon}</span>
                    <h3 className="font-semibold text-card-foreground mb-1 group-hover:text-primary transition-colors">
                      {topic.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {topic.courses} courses
                    </p>

                    <ArrowRight className="w-5 h-5 text-primary mt-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
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
