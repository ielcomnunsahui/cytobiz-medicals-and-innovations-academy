import { motion } from "framer-motion";
import { Shield, BadgeCheck, Award, Users, Globe, Handshake, ExternalLink } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const certifications = [
  {
    id: "wahbs",
    type: "Certified by",
    name: "West Africa Health Business Society (WAHBS)",
    logo: Shield,
    description: "Cytobiz Medical & Innovation Academy has been officially certified and recognized by the West Africa Health Business Society as a professional institution committed to excellence in medical education, health innovation, research, capacity building, and health-business development across West Africa.",
    scope: [
      "Medical Education",
      "Health Innovation",
      "Research & Capacity Development",
      "Health Entrepreneurship"
    ],
    status: "Accredited Member Institution",
    issueDate: "January 2026",
    validUntil: "January 2029",
    certificateNumber: "WAHBS/CERT/003C",
    certificateImage: "/certificates/wahbs-certificate.jpeg"
  },
  {
    id: "sdcc",
    type: "Accredited by",
    name: "Skill Development Council Canada",
    logo: BadgeCheck,
    description: "Our programs meet the international standards set by the Skill Development Council Canada, ensuring our graduates receive globally recognized credentials that enhance their career prospects worldwide.",
    scope: [
      "Program Quality Assurance",
      "International Standards Compliance",
      "Skills Assessment Framework",
      "Professional Development"
    ],
    status: "Accredited Training Provider",
    issueDate: "2025",
    validUntil: "2028",
    certificateNumber: "SDCC-2025-0892"
  }
];

const partners = [
  {
    name: "Google Developers Group",
    shortName: "GDG",
    description: "We collaborate with Google Developers Group to provide cutting-edge technology training and access to Google's vast ecosystem of development tools and resources.",
    benefits: [
      "Access to Google Cloud Platform resources",
      "Technical workshops and hackathons",
      "Mentorship from Google Developer Experts",
      "Career networking opportunities"
    ],
    color: "bg-blue-500"
  },
  {
    name: "Gemini",
    shortName: "Gemini",
    description: "Our partnership with Gemini brings advanced AI and machine learning capabilities to our healthcare innovation curriculum.",
    benefits: [
      "AI-powered learning tools",
      "Advanced analytics training",
      "Research collaboration opportunities",
      "Innovation lab access"
    ],
    color: "bg-purple-500"
  },
  {
    name: "Cardiovision",
    shortName: "CV",
    description: "Cardiovision partners with us to provide specialized cardiovascular health technology training and research opportunities.",
    benefits: [
      "Cardiovascular technology training",
      "Clinical research partnerships",
      "Medical device innovation",
      "Healthcare technology certifications"
    ],
    color: "bg-rose-500"
  }
];

export default function Partners() {
  return (
    <PageTransition>
      <SEOHead
        title="Partners & Accreditations | Cytobiz Medical Academy"
        description="Learn about our certifications from West Africa Health Business Society and Skill Development Council Canada, plus our partnerships with leading organizations."
      />
      <Navbar />
      
      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32 bg-gradient-to-br from-primary via-primary/90 to-primary/80 overflow-hidden">
          <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5" />
          <div className="container-wide relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl mx-auto"
            >
              <Badge variant="secondary" className="mb-4">
                <Award className="w-3 h-3 mr-1" />
                Globally Recognized
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6">
                Partners & Accreditations
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 max-w-2xl mx-auto">
                Our certifications and partnerships ensure you receive world-class education 
                that meets international standards and opens doors globally.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Certifications Section */}
        <section className="py-20 md:py-28">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <Badge variant="outline" className="mb-4">
                <Shield className="w-3 h-3 mr-1" />
                Official Recognition
              </Badge>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Our Certifications
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Cytobiz Medical & Innovation Academy is officially certified and accredited 
                by leading educational and professional bodies.
              </p>
            </motion.div>

            <div className="space-y-12">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden border-2 hover:border-primary/30 transition-colors">
                    <div className="grid md:grid-cols-2 gap-0">
                      {/* Info Column */}
                      <div className="p-6 md:p-8">
                        <CardHeader className="p-0 mb-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 rounded-xl bg-primary/10">
                              <cert.logo className="w-6 h-6 text-primary" />
                            </div>
                            <Badge variant="secondary">{cert.type}</Badge>
                          </div>
                          <CardTitle className="text-2xl md:text-3xl font-display">
                            {cert.name}
                          </CardTitle>
                        </CardHeader>
                        
                        <CardContent className="p-0 space-y-6">
                          <CardDescription className="text-base leading-relaxed">
                            {cert.description}
                          </CardDescription>

                          <div>
                            <h4 className="font-semibold text-foreground mb-3">Certification Scope:</h4>
                            <div className="flex flex-wrap gap-2">
                              {cert.scope.map((item) => (
                                <Badge key={item} variant="outline" className="text-sm">
                                  {item}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <Separator />

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Status</p>
                              <p className="font-medium text-primary">{cert.status}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Certificate Number</p>
                              <p className="font-mono font-medium">{cert.certificateNumber}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Date of Issue</p>
                              <p className="font-medium">{cert.issueDate}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Valid Until</p>
                              <p className="font-medium">{cert.validUntil}</p>
                            </div>
                          </div>
                        </CardContent>
                      </div>

                      {/* Certificate Image Column */}
                      <div className="bg-muted/30 p-6 md:p-8 flex items-center justify-center">
                        {cert.certificateImage ? (
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="relative group cursor-pointer"
                          >
                            <img
                              src={cert.certificateImage}
                              alt={`${cert.name} Certificate`}
                              className="max-w-full h-auto rounded-lg shadow-xl border-4 border-white"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
                              <Button
                                variant="secondary"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                asChild
                              >
                                <a href={cert.certificateImage} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  View Full Size
                                </a>
                              </Button>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="text-center">
                            <div className="w-32 h-32 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                              <cert.logo className="w-16 h-16 text-primary" />
                            </div>
                            <p className="text-muted-foreground">Certificate on file</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-20 md:py-28 bg-muted/30">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <Badge variant="outline" className="mb-4">
                <Handshake className="w-3 h-3 mr-1" />
                Strategic Partnerships
              </Badge>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Our Partners
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We collaborate with leading organizations to provide our students with 
                the best resources, tools, and opportunities.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {partners.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className={`w-16 h-16 rounded-2xl ${partner.color} flex items-center justify-center mb-4`}>
                        <span className="text-2xl font-bold text-white">{partner.shortName}</span>
                      </div>
                      <CardTitle className="text-xl">{partner.name}</CardTitle>
                      <CardDescription>{partner.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <h4 className="font-semibold text-sm text-foreground mb-3">Partnership Benefits:</h4>
                      <ul className="space-y-2">
                        {partner.benefits.map((benefit) => (
                          <li key={benefit} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <BadgeCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                            {benefit}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why This Matters */}
        <section className="py-20 md:py-28">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center"
            >
              <Badge variant="outline" className="mb-4">
                <Globe className="w-3 h-3 mr-1" />
                Global Impact
              </Badge>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
                Why Our Accreditations Matter
              </h2>
              <p className="text-lg text-muted-foreground mb-12">
                Our certifications and partnerships aren't just badges—they represent our 
                commitment to delivering education that meets the highest global standards.
              </p>

              <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: Award, label: "Internationally Recognized", value: "Credentials" },
                  { icon: Users, label: "Industry", value: "Connections" },
                  { icon: Shield, label: "Quality", value: "Assurance" },
                  { icon: Globe, label: "Global Career", value: "Opportunities" }
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="p-6 rounded-2xl bg-muted/50 border border-border"
                  >
                    <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                    <p className="font-bold text-foreground">{item.value}</p>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </PageTransition>
  );
}
