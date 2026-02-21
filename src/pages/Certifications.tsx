import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { PageTransition } from "@/components/PageTransition";
import { Award, Shield, BadgeCheck, Download, Globe2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logoFull from "@/assets/logo-full.png";

const certTypes = [
  {
    title: "Certificate of Completion",
    description: "Awarded upon completing any self-paced course on our platform.",
    features: ["Digital downloadable certificate", "Unique verification code", "LinkedIn-ready format", "Lifetime validity"],
    icon: Award,
    color: "from-primary to-accent",
  },
  {
    title: "Professional Diploma",
    description: "Awarded to learners who complete cohort-based programs with assessment requirements.",
    features: ["Accredited certification", "Comprehensive assessment", "Professional credential", "Industry recognized"],
    icon: Shield,
    color: "from-primary to-primary/70",
  },
];

const accreditations = [
  {
    name: "West Africa Health Business Society (WAHBS)",
    description: "Our programs are recognized and accredited by WAHBS, ensuring alignment with healthcare standards across West Africa.",
    logo: "/certificates/wahbs-certificate.jpeg",
  },
  {
    name: "Skill Development Council Canada (SDCC)",
    description: "International accreditation from SDCC validates our curriculum against global competency frameworks.",
    logo: "/certificates/sdcc-certificate.jpeg",
  },
];

const Certifications = () => {
  return (
    <PageTransition>
      <SEOHead
        title="Certifications & Accreditations | Cytobiz Medical Academy"
        description="Earn accredited healthcare certificates recognized by WAHBS and SDCC. Professional diplomas and certificates of completion."
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 pt-20">
          {/* Hero */}
          <section className="relative overflow-hidden bg-hero-gradient text-white py-24 md:py-32">
            <motion.div
              className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 10, repeat: Infinity }}
            />
            <div className="container-wide relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-3xl mx-auto text-center"
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
                  <Award className="w-4 h-4" />
                  <span className="text-sm font-medium">Certifications & Accreditations</span>
                </div>
                <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
                  Credentials That
                  <span className="block text-primary/80">Open Doors</span>
                </h1>
                <p className="text-xl text-white/70 max-w-2xl mx-auto mb-8">
                  Our certificates are backed by international accreditation bodies, giving you credentials that employers and institutions trust.
                </p>
                <Button size="lg" asChild className="bg-white text-navy hover:bg-white/90">
                  <Link to="/courses">Browse Courses</Link>
                </Button>
              </motion.div>
            </div>
          </section>

          {/* Certificate Types */}
          <section className="section-padding">
            <div className="container-wide">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center max-w-2xl mx-auto mb-12"
              >
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Types of Certificates
                </h2>
                <p className="text-muted-foreground">
                  Choose the learning path that fits your goals and earn a credential that reflects your achievement.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {certTypes.map((cert, i) => (
                  <motion.div
                    key={cert.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="bg-card border border-border rounded-2xl p-8 hover-lift"
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cert.color} flex items-center justify-center mb-6`}>
                      <cert.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">{cert.title}</h3>
                    <p className="text-muted-foreground mb-6">{cert.description}</p>
                    <ul className="space-y-3">
                      {cert.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-foreground">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Accreditations */}
          <section className="section-padding bg-muted/30">
            <div className="container-wide">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center max-w-2xl mx-auto mb-12"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  <BadgeCheck className="w-4 h-4" />
                  Accreditations
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Internationally Recognized
                </h2>
                <p className="text-muted-foreground">
                  Our programs are accredited by leading healthcare education bodies.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {accreditations.map((acc, i) => (
                  <motion.div
                    key={acc.name}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="bg-card border border-border rounded-2xl overflow-hidden"
                  >
                    <div className="aspect-video bg-muted flex items-center justify-center p-6">
                      <img src={acc.logo} alt={acc.name} className="max-h-full max-w-full object-contain rounded-lg" />
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-foreground mb-2">{acc.name}</h3>
                      <p className="text-sm text-muted-foreground">{acc.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Verification */}
          <section className="section-padding">
            <div className="container-wide max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Globe2 className="w-12 h-12 text-primary mx-auto mb-6" />
                <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                  Certificate Verification
                </h2>
                <p className="text-muted-foreground mb-8">
                  Every certificate issued by Cytobiz Medical & Innovation Academy comes with a unique verification code. Employers and institutions can verify authenticity through our platform.
                </p>
                <Button size="lg" asChild>
                  <Link to="/contact">Contact for Verification</Link>
                </Button>
              </motion.div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Certifications;
