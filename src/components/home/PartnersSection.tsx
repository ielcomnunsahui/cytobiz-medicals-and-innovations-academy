import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const partners = [
  { name: "Google Developer Student Clubs", logo: "/partners/gdsc-logo.jpeg" },
  { name: "Gemini", logo: "/partners/gemini-logo.jpeg" },
  { name: "Cardiovision", logo: "/partners/cardiovision-logo.jpeg" },
  { name: "Ilorin Innovation Hub", logo: "/partners/ilorin-innovation-hub-logo.jpeg" },
];

export function PartnersSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <section ref={ref} className="py-16 bg-background border-y border-border overflow-hidden">
      <div className="container-wide mb-8">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center text-sm text-muted-foreground uppercase tracking-widest"
        >
          Trusted Partners
        </motion.p>
      </div>

      {/* Infinite scroll container */}
      <div className="relative">
        {/* Gradient overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        {/* Scrolling logos */}
        <motion.div
          className="flex gap-16 items-center"
          animate={{
            x: [0, -1600],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {/* Duplicate logos for seamless loop */}
          {[...partners, ...partners, ...partners, ...partners].map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex-shrink-0 flex items-center gap-4 group"
            >
              <div className="h-14 w-auto flex items-center justify-center bg-white rounded-lg p-2 group-hover:shadow-md transition-shadow">
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="h-10 w-auto object-contain max-w-[160px]"
                />
              </div>
              <span className="text-muted-foreground font-medium whitespace-nowrap group-hover:text-foreground transition-colors">
                {partner.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
