import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";

interface MotivationStepProps {
  formData: Record<string, any>;
  updateField: (key: string, value: any) => void;
  errors: Record<string, string>;
}

const DISCOVERY_OPTIONS = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "twitter", label: "X (Twitter)" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "google", label: "Google Search" },
  { value: "friend", label: "Friend/Colleague" },
  { value: "other", label: "Other" },
];

export function MotivationStep({ formData, updateField, errors }: MotivationStepProps) {
  const showOtherInput = formData.discovery_source === "other";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Motivation & Discovery</h2>
        <p className="text-sm text-muted-foreground">
          Share why you're interested in this course and how you found us.
        </p>
      </div>

      <div className="space-y-6">
        {/* Why do you want to take this course? */}
        <div className="space-y-2">
          <Label htmlFor="motivation">
            Why do you want to take this course? <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="motivation"
            placeholder="Tell us about your goals, what you hope to learn, and how this course fits into your career plans..."
            value={formData.motivation || ""}
            onChange={(e) => updateField("motivation", e.target.value)}
            className={`min-h-[120px] resize-none ${errors.motivation ? "border-destructive" : ""}`}
          />
          <div className="flex justify-between text-xs">
            {errors.motivation ? (
              <p className="text-destructive">{errors.motivation}</p>
            ) : (
              <p className="text-muted-foreground">Minimum 20 characters</p>
            )}
            <span className="text-muted-foreground">
              {(formData.motivation || "").length} characters
            </span>
          </div>
        </div>

        {/* How did you hear about us? */}
        <div className="space-y-3">
          <Label>
            How did you hear about Cytobiz Courses? <span className="text-destructive">*</span>
          </Label>
          <RadioGroup
            value={formData.discovery_source || ""}
            onValueChange={(value) => {
              updateField("discovery_source", value);
              if (value !== "other") {
                updateField("discovery_source_other", "");
              }
            }}
            className="grid sm:grid-cols-2 gap-2"
          >
            {DISCOVERY_OPTIONS.map((option) => (
              <div
                key={option.value}
                className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors cursor-pointer ${
                  formData.discovery_source === option.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="font-normal cursor-pointer flex-1">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {errors.discovery_source && (
            <p className="text-xs text-destructive">{errors.discovery_source}</p>
          )}
        </div>

        {/* Other Source Input */}
        {showOtherInput && (
          <div className="space-y-2 pl-4 border-l-2 border-primary/20">
            <Label htmlFor="discovery_source_other">
              Please specify <span className="text-destructive">*</span>
            </Label>
            <Input
              id="discovery_source_other"
              type="text"
              placeholder="Where did you hear about us?"
              value={formData.discovery_source_other || ""}
              onChange={(e) => updateField("discovery_source_other", e.target.value)}
              className={errors.discovery_source_other ? "border-destructive" : ""}
            />
            {errors.discovery_source_other && (
              <p className="text-xs text-destructive">{errors.discovery_source_other}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
