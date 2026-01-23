import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const partners = [
  { name: "Google Developers Group", logo: "GDG" },
  { name: "Gemini", logo: "Gemini" },
  { name: "Cardiovision", logo: "CV" },
  { name: "Google Developers Group", logo: "GDG" },
  { name: "Gemini", logo: "Gemini" },
  { name: "Cardiovision", logo: "CV" },
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
            x: [0, -1200],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            },
          }}
        >
          {/* Duplicate logos for seamless loop */}
          {[...partners, ...partners, ...partners].map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex-shrink-0 flex items-center gap-3 group"
            >
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <span className="font-bold text-muted-foreground group-hover:text-primary transition-colors">
                  {partner.logo}
                </span>
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
