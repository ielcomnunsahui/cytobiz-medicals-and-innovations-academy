import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const learningPaths = [
  {
    id: "individual",
    icon: User,
    label: "Study at your own pace",
    title: "Learn as an individual",
    features: [
      "Internationally recognized certificates",
      "Flexible, self-paced learning tailored to your schedule",
      "Join a global community of learners",
    ],
    cta: "Explore Courses",
    ctaLink: "/courses",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop",
  },
  {
    id: "team",
    icon: Users,
    label: "Upskill your team",
    title: "Learning solutions for organizations",
    features: [
      "Engaging learning experiences at scale",
      "Solutions for in-demand skill areas",
      "Variety of formats from long-form to short-form content",
      "Interaction with a global community of leaders",
    ],
    cta: "Contact Our Team",
    ctaLink: "/contact",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop",
  },
];

export function LearningPathsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="section-padding bg-background">
      <div className="container-wide">
        {/* Toggle Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="flex justify-center mb-16"
        >
          <div className="inline-flex rounded-full bg-muted p-1">
            {learningPaths.map((path) => (
              <Link
                key={path.id}
                to={path.ctaLink}
                className="px-6 py-3 rounded-full text-sm font-medium transition-all hover:bg-card first:bg-card first:shadow-sm"
              >
                <path.icon className="w-4 h-4 inline-block mr-2" />
                {path.id === "individual" ? "For myself" : "For my team"}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {learningPaths.map((path, index) => (
            <motion.div
              key={path.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group relative bg-card rounded-3xl overflow-hidden border border-border hover:border-primary/30 transition-all"
            >
              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={path.image}
                  alt={path.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-8 -mt-20 relative">
                <p className="text-sm text-muted-foreground mb-2">{path.label}</p>
                <h3 className="text-2xl font-bold text-card-foreground mb-6">
                  {path.title}
                </h3>

                <ul className="space-y-3 mb-8">
                  {path.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 text-primary-foreground group/btn"
                >
                  <Link to={path.ctaLink}>
                    {path.cta}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
