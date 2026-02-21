import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SEOHead } from "@/components/SEOHead";
import { PageTransition } from "@/components/PageTransition";
import { Linkedin, Users, Heart, Award } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import teamPhoto from "@/assets/team-photo.jpeg";

const Team = () => {
  const { data: facilitators, isLoading } = useQuery({
    queryKey: ["facilitators-team"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("facilitators")
        .select("*")
        .order("display_order", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  return (
    <PageTransition>
      <SEOHead
        title="Our Team | Cytobiz Medical Academy"
        description="Meet the expert facilitators and leaders behind Cytobiz Medical & Innovation Academy."
      />
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 pt-20">
          {/* Hero */}
          <section className="relative min-h-[50vh] flex items-center overflow-hidden">
            <div className="absolute inset-0">
              <img src={teamPhoto} alt="Our Team" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
            <div className="container-wide relative z-10 py-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
              >
                <Users className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Our Team</span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6"
              >
                Meet the Experts Behind
                <br />
                <span className="text-primary">Your Learning Journey</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-muted-foreground max-w-2xl"
              >
                Our team of experienced healthcare professionals and educators is dedicated to delivering world-class medical education.
              </motion.p>
            </div>
          </section>

          {/* Stats */}
          <section className="py-12 bg-muted/30">
            <div className="container-wide grid grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                { icon: Users, value: `${facilitators?.length || 0}+`, label: "Expert Facilitators" },
                { icon: Heart, value: "15+", label: "Years Combined Experience" },
                { icon: Award, value: "40+", label: "Countries Reached" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Team Grid */}
          <section className="section-padding">
            <div className="container-wide">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center max-w-2xl mx-auto mb-12"
              >
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Our Facilitators
                </h2>
                <p className="text-muted-foreground">
                  Industry leaders who bring real-world expertise to every course.
                </p>
              </motion.div>

              {isLoading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-80 rounded-2xl" />
                  ))}
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {facilitators?.map((f, i) => (
                    <motion.div
                      key={f.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className="group bg-card rounded-2xl border border-border overflow-hidden hover-lift"
                    >
                      <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                        {f.avatar_url ? (
                          <img src={f.avatar_url} alt={f.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-3xl font-bold text-primary">
                              {f.name.split(" ").map((n: string) => n[0]).join("")}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-foreground">{f.name}</h3>
                        {f.title && <p className="text-sm text-primary font-medium mb-2">{f.title}</p>}
                        {f.bio && <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{f.bio}</p>}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {f.expertise?.slice(0, 3).map((e: string) => (
                            <span key={e} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                              {e}
                            </span>
                          ))}
                        </div>
                        {f.linkedin_url && (
                          <a
                            href={f.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Linkedin className="w-4 h-4" />
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Team;
