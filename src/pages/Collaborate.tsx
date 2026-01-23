import { motion } from "framer-motion";
import { UserPlus, Building2, BookOpen, Briefcase, CheckCircle2, ArrowRight, Handshake, Globe } from "lucide-react";
import { PageTransition } from "@/components/PageTransition";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

const partnershipTypes = [
  {
    icon: BookOpen,
    title: "Curriculum Development",
    description: "Co-create industry-relevant courses and training materials with our academic team.",
    benefits: [
      "Shape the next generation of healthcare professionals",
      "Integrate your expertise into our curriculum",
      "Access to our learning platform for content delivery"
    ]
  },
  {
    icon: Briefcase,
    title: "Corporate Training",
    description: "Upskill your healthcare workforce with customized training programs.",
    benefits: [
      "Tailored programs for your organization's needs",
      "Flexible delivery: online, in-person, or hybrid",
      "Progress tracking and certification"
    ]
  },
  {
    icon: Building2,
    title: "Research Partnership",
    description: "Collaborate on healthcare research projects and clinical studies.",
    benefits: [
      "Access to our academic network",
      "Joint publication opportunities",
      "Research funding support"
    ]
  },
  {
    icon: Globe,
    title: "International Collaboration",
    description: "Partner with us to expand healthcare education across Africa and beyond.",
    benefits: [
      "Cross-border learning initiatives",
      "Student exchange programs",
      "Joint certification programs"
    ]
  }
];

const currentPartners = [
  { name: "Google Developers Group", logo: "/partners/gdsc-logo.jpeg" },
  { name: "Gemini", logo: "/partners/gemini-logo.jpeg" },
  { name: "Cardiovision", logo: "/partners/cardiovision-logo.jpeg" },
  { name: "Ilorin Innovation Hub", logo: "/partners/ilorin-innovation-hub-logo.jpeg" }
];

export default function Collaborate() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Partnership inquiry submitted! Our team will reach out within 48 hours.");
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <PageTransition>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-gradient-to-br from-primary/10 via-background to-background">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <Badge variant="outline" className="mb-4">
                <Handshake className="w-3 h-3 mr-1" />
                Strategic Partnerships
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6">
                Collaborate <span className="text-primary">with Us</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Partner with Cytobiz Medical Academy to shape the future of healthcare education. 
                Together, we can create meaningful impact across Africa.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Partnership Types */}
        <section className="py-20 md:py-28">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Partnership Opportunities
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Explore the different ways your organization can partner with us to advance healthcare education.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {partnershipTypes.map((type, index) => (
                <motion.div
                  key={type.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <type.icon className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{type.title}</CardTitle>
                      <CardDescription className="text-base">{type.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {type.benefits.map((benefit) => (
                          <li key={benefit} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                            <span className="text-sm text-muted-foreground">{benefit}</span>
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

        {/* Current Partners */}
        <section className="py-16 bg-muted/50">
          <div className="container-wide">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-10"
            >
              <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                Our Current Partners
              </h3>
              <p className="text-muted-foreground">
                Join these organizations in shaping healthcare education
              </p>
            </motion.div>

            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
              {currentPartners.map((partner, index) => (
                <motion.div
                  key={partner.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 shadow-sm"
                >
                  <img 
                    src={partner.logo} 
                    alt={partner.name} 
                    className="h-12 w-auto object-contain"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Partnership Form */}
        <section id="partnership-form" className="py-20 md:py-28">
          <div className="container-wide">
            <div className="max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                  Start a Partnership
                </h2>
                <p className="text-muted-foreground">
                  Tell us about your organization and how you'd like to collaborate.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Your Name</Label>
                          <Input id="name" name="name" placeholder="Jane Smith" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="organization">Organization</Label>
                          <Input id="organization" name="organization" placeholder="Company/Institution Name" required />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" name="email" type="email" placeholder="jane@company.com" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" name="phone" type="tel" placeholder="+234 800 000 0000" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role">Your Role</Label>
                        <Input id="role" name="role" placeholder="e.g., Director of Training, CEO" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="partnershipType">Partnership Type</Label>
                        <Select name="partnershipType" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select partnership type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="curriculum">Curriculum Development</SelectItem>
                            <SelectItem value="corporate">Corporate Training</SelectItem>
                            <SelectItem value="research">Research Partnership</SelectItem>
                            <SelectItem value="international">International Collaboration</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="proposal">Partnership Proposal</Label>
                        <Textarea 
                          id="proposal" 
                          name="proposal" 
                          placeholder="Describe your partnership idea, goals, and how you envision our collaboration..."
                          rows={5}
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit Partnership Inquiry"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </PageTransition>
  );
}
