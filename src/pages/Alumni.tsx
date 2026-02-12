import { useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Upload,
  Loader2,
  MapPin,
  Linkedin,
  Briefcase,
  Award,
  CheckCircle,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function AlumniPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [certFile, setCertFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    full_name: "",
    phone: "",
    email: "",
    linkedin_url: "",
    location: "",
    course_completed: "",
    field_of_practice: "",
    area_of_expertise: "",
    testimonial: "",
    would_recommend: "yes",
  });

  // Fetch approved alumni
  const { data: alumni, isLoading } = useQuery({
    queryKey: ["alumni"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("alumni")
        .select("*")
        .eq("is_approved", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to register as alumni");
      return;
    }

    setIsSubmitting(true);
    try {
      let photoUrl = "";
      let certUrl = "";

      // Upload photo
      if (photoFile) {
        const ext = photoFile.name.split(".").pop();
        const path = `${user.id}/photo.${ext}`;
        const { error } = await supabase.storage.from("alumni-photos").upload(path, photoFile, { upsert: true });
        if (error) throw error;
        const { data: urlData } = supabase.storage.from("alumni-photos").getPublicUrl(path);
        photoUrl = urlData.publicUrl;
      }

      // Upload certificate
      if (certFile) {
        const ext = certFile.name.split(".").pop();
        const path = `${user.id}/certificate.${ext}`;
        const { error } = await supabase.storage.from("alumni-photos").upload(path, certFile, { upsert: true });
        if (error) throw error;
        const { data: urlData } = supabase.storage.from("alumni-photos").getPublicUrl(path);
        certUrl = urlData.publicUrl;
      }

      const { error } = await supabase.from("alumni").insert({
        user_id: user.id,
        full_name: form.full_name,
        phone: form.phone,
        email: form.email,
        linkedin_url: form.linkedin_url,
        location: form.location,
        course_completed: form.course_completed,
        certificate_url: certUrl,
        photo_url: photoUrl,
        field_of_practice: form.field_of_practice,
        area_of_expertise: form.area_of_expertise,
        testimonial: form.testimonial,
        would_recommend: form.would_recommend === "yes",
      });

      if (error) throw error;

      toast.success("Alumni registration submitted successfully!");
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ["alumni"] });
      setForm({
        full_name: "", phone: "", email: "", linkedin_url: "", location: "",
        course_completed: "", field_of_practice: "", area_of_expertise: "",
        testimonial: "", would_recommend: "yes",
      });
      setPhotoFile(null);
      setCertFile(null);
      setPhotoPreview(null);
    } catch (error: any) {
      toast.error(`Submission failed: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container-wide">
          {/* Hero */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <Badge variant="outline" className="mb-4">
              <Users className="w-3 h-3 mr-1" /> Community
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Alumni Network</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Connect with graduates of Cytobiz Medical & Innovation Academy. Join our growing community of healthcare professionals.
            </p>
            {user && (
              <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogTrigger asChild>
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Join Alumni Network
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Alumni Network Registration</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Photo Upload */}
                    <div className="space-y-2">
                      <Label>Profile Photo</Label>
                      <div className="flex items-center gap-4">
                        {photoPreview ? (
                          <Avatar className="w-20 h-20">
                            <AvatarImage src={photoPreview} />
                            <AvatarFallback>PH</AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                            <Upload className="w-6 h-6 text-muted-foreground" />
                          </div>
                        )}
                        <Input type="file" accept="image/*" onChange={handlePhotoChange} />
                      </div>
                    </div>

                    {/* Personal Details */}
                    <div className="space-y-1 text-sm font-semibold text-muted-foreground uppercase tracking-wide">Personal Details</div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Full Name *</Label>
                        <Input value={form.full_name} onChange={e => updateField("full_name", e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Phone Number</Label>
                        <Input value={form.phone} onChange={e => updateField("phone", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Email Address *</Label>
                        <Input type="email" value={form.email} onChange={e => updateField("email", e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label>LinkedIn Profile Link</Label>
                        <Input value={form.linkedin_url} onChange={e => updateField("linkedin_url", e.target.value)} placeholder="https://linkedin.com/in/..." />
                      </div>
                      <div className="sm:col-span-2 space-y-2">
                        <Label>Current Location (City & State)</Label>
                        <Input value={form.location} onChange={e => updateField("location", e.target.value)} />
                      </div>
                    </div>

                    {/* Academic Information */}
                    <div className="space-y-1 text-sm font-semibold text-muted-foreground uppercase tracking-wide">Academic Information</div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Course Completed *</Label>
                        <Input value={form.course_completed} onChange={e => updateField("course_completed", e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Certificate Upload</Label>
                        <Input type="file" accept="image/*,.pdf" onChange={e => setCertFile(e.target.files?.[0] || null)} />
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div className="space-y-1 text-sm font-semibold text-muted-foreground uppercase tracking-wide">Professional Information</div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Field of Practice</Label>
                        <Input value={form.field_of_practice} onChange={e => updateField("field_of_practice", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Area of Expertise</Label>
                        <Input value={form.area_of_expertise} onChange={e => updateField("area_of_expertise", e.target.value)} />
                      </div>
                    </div>

                    {/* Alumni Reflection */}
                    <div className="space-y-1 text-sm font-semibold text-muted-foreground uppercase tracking-wide">Alumni Reflection</div>
                    <div className="space-y-2">
                      <Label>Share a short testimonial about your experience *</Label>
                      <Textarea
                        value={form.testimonial}
                        onChange={e => updateField("testimonial", e.target.value)}
                        placeholder="What did you learn? How did it impact your skills, confidence, or career journey?"
                        rows={4}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Would you recommend it to others?</Label>
                      <RadioGroup value={form.would_recommend} onValueChange={v => updateField("would_recommend", v)}>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yes" id="yes" />
                            <Label htmlFor="yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="no" id="no" />
                            <Label htmlFor="no">No</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : "Submit Registration"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
            {!user && (
              <p className="text-sm text-muted-foreground">Please <a href="/login" className="text-primary underline">log in</a> to join the alumni network.</p>
            )}
          </motion.div>

          {/* Alumni Grid */}
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : alumni && alumni.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {alumni.map((person, i) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={person.photo_url || ""} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                            {person.full_name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">{person.full_name}</h3>
                          {person.field_of_practice && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Briefcase className="w-3 h-3" />
                              <span className="truncate">{person.field_of_practice}</span>
                            </div>
                          )}
                          {person.location && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{person.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      {person.course_completed && (
                        <Badge variant="secondary" className="mb-3">
                          <Award className="w-3 h-3 mr-1" />
                          {person.course_completed}
                        </Badge>
                      )}
                      {person.area_of_expertise && (
                        <Badge variant="outline" className="mb-3 ml-2">
                          {person.area_of_expertise}
                        </Badge>
                      )}
                      {person.testimonial && (
                        <p className="text-sm text-muted-foreground mt-3 line-clamp-3 italic">
                          "{person.testimonial}"
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-4">
                        {person.would_recommend && (
                          <div className="flex items-center gap-1 text-xs text-success">
                            <Star className="w-3 h-3 fill-current" />
                            Recommends
                          </div>
                        )}
                        {person.linkedin_url && (
                          <a
                            href={person.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-auto text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No alumni yet</h3>
              <p className="text-muted-foreground">Be the first to join our alumni network!</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
