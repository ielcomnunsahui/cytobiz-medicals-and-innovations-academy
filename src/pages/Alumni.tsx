import { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Linkedin, Award, Users, Upload, CheckCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEOHead } from "@/components/SEOHead";
import { PageTransition } from "@/components/PageTransition";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Alumni() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    linkedin_url: "",
    location: "",
    course_completed: "",
    field_of_practice: "",
    area_of_expertise: "",
    testimonial: "",
    would_recommend: true,
  });
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { data: alumni, isLoading } = useQuery({
    queryKey: ["alumni-public"],
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

  // Check if user already submitted
  const { data: existingSubmission } = useQuery({
    queryKey: ["alumni-submission", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("alumni")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch courses for dropdown
  const { data: courses } = useQuery({
    queryKey: ["courses-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title")
        .eq("status", "published")
        .order("title");
      if (error) throw error;
      return data;
    },
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("Please log in to register");

      let certificate_url: string | null = null;

      if (certificateFile) {
        setUploading(true);
        const fileExt = certificateFile.name.split(".").pop();
        const filePath = `${user.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("alumni-photos")
          .upload(filePath, certificateFile);
        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("alumni-photos")
          .getPublicUrl(filePath);
        certificate_url = urlData.publicUrl;
        setUploading(false);
      }

      const { error } = await supabase.from("alumni").insert({
        user_id: user.id,
        full_name: formData.full_name.trim(),
        phone: formData.phone.trim() || null,
        email: formData.email.trim(),
        linkedin_url: formData.linkedin_url.trim() || null,
        location: formData.location.trim() || null,
        course_completed: formData.course_completed || null,
        field_of_practice: formData.field_of_practice.trim() || null,
        area_of_expertise: formData.area_of_expertise.trim() || null,
        testimonial: formData.testimonial.trim() || null,
        would_recommend: formData.would_recommend,
        certificate_url,
        is_approved: false,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Alumni registration submitted! It will be reviewed by an admin.");
      queryClient.invalidateQueries({ queryKey: ["alumni-submission", user?.id] });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const filtered = alumni?.filter((a) =>
    a.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.field_of_practice?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.area_of_expertise?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageTransition>
      <SEOHead
        title="Alumni Network | Cytobiz Medical Academy"
        description="Meet our alumni making an impact in healthcare across Africa and beyond."
      />
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="container-wide">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              Our Community
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Alumni Network
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Our graduates are transforming healthcare across Africa and beyond. Discover their stories and connect with fellow professionals.
            </p>
          </motion.div>

          <Tabs defaultValue="directory" className="space-y-8">
            <TabsList className="mx-auto flex w-fit">
              <TabsTrigger value="directory">Alumni Directory</TabsTrigger>
              <TabsTrigger value="register">Join Alumni Network</TabsTrigger>
            </TabsList>

            {/* Directory Tab */}
            <TabsContent value="directory">
              {/* Search */}
              <div className="max-w-md mx-auto mb-10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, field, or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Alumni Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-card border border-border rounded-xl p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Skeleton className="w-14 h-14 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ))}
                </div>
              ) : filtered?.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-40" />
                  <p className="text-lg">No alumni found</p>
                  <p className="text-sm">Try adjusting your search query</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered?.map((alum, index) => (
                    <motion.div
                      key={alum.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 hover:shadow-lg transition-all"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="w-14 h-14">
                          <AvatarImage src={alum.photo_url || ""} />
                          <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                            {alum.full_name[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground">{alum.full_name}</h3>
                          {alum.field_of_practice && (
                            <p className="text-sm text-muted-foreground">{alum.field_of_practice}</p>
                          )}
                        </div>
                      </div>

                      {alum.area_of_expertise && (
                        <Badge variant="secondary" className="mb-3">
                          <Award className="w-3 h-3 mr-1" />
                          {alum.area_of_expertise}
                        </Badge>
                      )}

                      {alum.location && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                          <MapPin className="w-3 h-3" />
                          {alum.location}
                        </p>
                      )}

                      {alum.testimonial && (
                        <p className="text-sm text-muted-foreground italic line-clamp-3">
                          "{alum.testimonial}"
                        </p>
                      )}

                      {alum.linkedin_url && (
                        <a
                          href={alum.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-3"
                        >
                          <Linkedin className="w-4 h-4" />
                          LinkedIn Profile
                        </a>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Registration Tab */}
            <TabsContent value="register">
              <div className="max-w-2xl mx-auto">
                {!user ? (
                  <div className="bg-card border border-border rounded-xl p-8 text-center">
                    <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">Login Required</h3>
                    <p className="text-muted-foreground mb-4">Please log in to register as an alumni.</p>
                    <Button asChild>
                      <a href="/login">Log In</a>
                    </Button>
                  </div>
                ) : existingSubmission ? (
                  <div className="bg-card border border-border rounded-xl p-8 text-center">
                    <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">
                      {existingSubmission.is_approved ? "You're in the Alumni Network!" : "Registration Submitted"}
                    </h3>
                    <p className="text-muted-foreground">
                      {existingSubmission.is_approved
                        ? "Your profile is visible in the alumni directory."
                        : "Your registration is pending admin approval."}
                    </p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-xl p-6 md:p-8"
                  >
                    <h2 className="text-2xl font-bold text-foreground mb-2">Alumni Network Registration Form</h2>
                    <p className="text-muted-foreground mb-8">Join our growing community of healthcare professionals.</p>

                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!formData.full_name.trim() || !formData.email.trim()) {
                          toast.error("Full name and email are required.");
                          return;
                        }
                        submitMutation.mutate();
                      }}
                      className="space-y-8"
                    >
                      {/* Personal Details */}
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">Personal Details</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name *</Label>
                            <Input
                              id="full_name"
                              required
                              value={formData.full_name}
                              onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                              placeholder="Your full name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                              placeholder="+234..."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                              id="email"
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                              placeholder="your@email.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="linkedin">LinkedIn Profile Link</Label>
                            <Input
                              id="linkedin"
                              value={formData.linkedin_url}
                              onChange={(e) => setFormData(prev => ({ ...prev, linkedin_url: e.target.value }))}
                              placeholder="https://linkedin.com/in/..."
                            />
                          </div>
                          <div className="space-y-2 sm:col-span-2">
                            <Label htmlFor="location">Current Location (City & State)</Label>
                            <Input
                              id="location"
                              value={formData.location}
                              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                              placeholder="Lagos, Nigeria"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Academic Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">Academic Information</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="course">Course Completed</Label>
                            <select
                              id="course"
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                              value={formData.course_completed}
                              onChange={(e) => setFormData(prev => ({ ...prev, course_completed: e.target.value }))}
                            >
                              <option value="">Select a course</option>
                              {courses?.map((c) => (
                                <option key={c.id} value={c.title}>{c.title}</option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="certificate">Certificate Upload</Label>
                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-2 px-4 py-2 border border-input rounded-md cursor-pointer hover:bg-muted transition-colors text-sm">
                                <Upload className="w-4 h-4" />
                                {certificateFile ? certificateFile.name : "Choose file"}
                                <input
                                  type="file"
                                  accept="image/*,.pdf"
                                  className="hidden"
                                  onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Professional Information */}
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">Professional Information</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="field">Field of Practice</Label>
                            <Input
                              id="field"
                              value={formData.field_of_practice}
                              onChange={(e) => setFormData(prev => ({ ...prev, field_of_practice: e.target.value }))}
                              placeholder="e.g. Public Health, Clinical Research"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="expertise">Area of Expertise</Label>
                            <Input
                              id="expertise"
                              value={formData.area_of_expertise}
                              onChange={(e) => setFormData(prev => ({ ...prev, area_of_expertise: e.target.value }))}
                              placeholder="e.g. Epidemiology, Health Informatics"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Alumni Reflection */}
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">Alumni Reflection</h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="testimonial">
                              Share a short testimonial about your experience at Cytobiz Medical & Innovation Academy
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              What did you learn? How did it impact your skills, confidence, or career journey?
                            </p>
                            <Textarea
                              id="testimonial"
                              rows={4}
                              value={formData.testimonial}
                              onChange={(e) => setFormData(prev => ({ ...prev, testimonial: e.target.value }))}
                              placeholder="Share your experience..."
                            />
                          </div>
                          <div className="space-y-3">
                            <Label>Would you recommend Cytobiz to others?</Label>
                            <RadioGroup
                              value={formData.would_recommend ? "yes" : "no"}
                              onValueChange={(v) => setFormData(prev => ({ ...prev, would_recommend: v === "yes" }))}
                              className="flex gap-6"
                            >
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="yes" id="rec-yes" />
                                <Label htmlFor="rec-yes" className="font-normal">Yes</Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <RadioGroupItem value="no" id="rec-no" />
                                <Label htmlFor="rec-no" className="font-normal">No</Label>
                              </div>
                            </RadioGroup>
                          </div>
                        </div>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={submitMutation.isPending || uploading}
                      >
                        {submitMutation.isPending || uploading ? "Submitting..." : "Submit Registration"}
                      </Button>
                    </form>
                  </motion.div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
}
