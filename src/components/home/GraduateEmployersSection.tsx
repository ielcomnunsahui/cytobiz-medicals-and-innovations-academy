import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Briefcase } from "lucide-react";

const employers = [
  { name: "University Hospital", logo: "🏥" },
  { name: "HealthTech Africa", logo: "🌍" },
  { name: "MediCare Plus", logo: "➕" },
  { name: "Global Health Initiative", logo: "🌐" },
  { name: "CardioLife Clinic", logo: "❤️" },
  { name: "PharmaCorp Nigeria", logo: "💊" },
  { name: "Digital Health Labs", logo: "🔬" },
  { name: "Community Health Network", logo: "🤝" },
  { name: "Wellness Foundation", logo: "🌱" },
  { name: "Medical Innovation Hub", logo: "💡" },
  { name: "NEMA", logo: "/employers/nema-logo.jpeg" },
  { name: "Society for Family Health", logo: "/employers/sfh-logo.jpeg" },
  { name: "Olabisi Onabanjo University", logo: "/employers/oou-logo.jpeg" },
  { name: "Al-Hikmah University, Ilorin", logo: "/employers/alhikmah-logo.jpeg" },
  { name: "Federal University of Health Sciences, Ila Orangun", logo: "/employers/fuhs-logo.jpeg" },
  { name: "Digital Health Africa", logo: "💊"},
];

export function GraduateEmployersSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="py-16 bg-muted/30 overflow-hidden">
      <div className="container-wide mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Briefcase className="w-4 h-4" />
            Career Outcomes
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Where Our Learners Work
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our graduates are making an impact at leading healthcare organizations, hospitals,
            universities, and agencies across Africa and beyond.
          </p>
        </motion.div>
      </div>

      {/* Infinite scrolling logo carousel */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-muted/30 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-muted/30 to-transparent z-10 pointer-events-none" />

        <div className="flex overflow-hidden">
          <motion.div
            className="flex gap-8 items-center"
            animate={{ x: [0, -2400] }}
            transition={{
              x: { repeat: Infinity, repeatType: "loop", duration: 40, ease: "linear" },
            }}
          >
            {[...employers, ...employers, ...employers].map((employer, index) => (
              <div key={`${employer.name}-${index}`} className="flex-shrink-0 group">
                <div className="flex flex-col items-center gap-3 px-6 py-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 min-w-[180px]">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform">
                    {employer.logo ? (
                      <img
                        src={employer.logo}
                        alt={employer.name}
                        className="w-14 h-14 object-contain rounded-lg"
                      />
                    ) : (
                      <Briefcase className="w-7 h-7 text-primary/60" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground whitespace-nowrap transition-colors max-w-[160px] truncate">
                    {employer.name}
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Stats row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="container-wide mt-12"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-1">95%</div>
            <div className="text-sm text-muted-foreground">Employment Rate</div>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-1">500+</div>
            <div className="text-sm text-muted-foreground">Graduates Placed</div>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-1">50+</div>
            <div className="text-sm text-muted-foreground">Partner Organizations</div>
          </div>
          <div className="text-center p-4">
            <div className="text-3xl md:text-4xl font-bold text-primary mb-1">12</div>
            <div className="text-sm text-muted-foreground">Countries</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
