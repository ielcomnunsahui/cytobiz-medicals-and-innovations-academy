import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BackgroundStepProps {
  formData: Record<string, any>;
  updateField: (key: string, value: any) => void;
  errors: Record<string, string>;
}

const EDUCATION_LEVELS = [
  "Secondary School Graduate",
  "Diploma",
  "Undergraduate",
  "Graduate",
  "Postgraduate",
];

const CURRENT_STATUS_OPTIONS = [
  "Healthcare Professional",
  "Student",
  "Innovator",
  "Other",
];

export function BackgroundStep({ formData, updateField, errors }: BackgroundStepProps) {
  const showOtherInput = formData.current_status === "Other";

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-foreground">Professional & Educational Background</h2>
        <p className="text-sm text-muted-foreground">
          Help us understand your background to personalize your learning experience.
        </p>
      </div>

      <div className="space-y-4">
        {/* Educational Background */}
        <div className="space-y-2">
          <Label htmlFor="education">
            Educational Background <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.education || ""}
            onValueChange={(value) => updateField("education", value)}
          >
            <SelectTrigger className={errors.education ? "border-destructive" : ""}>
              <SelectValue placeholder="Select your highest qualification" />
            </SelectTrigger>
            <SelectContent>
              {EDUCATION_LEVELS.map((level) => (
                <SelectItem key={level} value={level}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.education && (
            <p className="text-xs text-destructive">{errors.education}</p>
          )}
        </div>

        {/* Current Status */}
        <div className="space-y-2">
          <Label htmlFor="current_status">
            Current Status <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.current_status || ""}
            onValueChange={(value) => {
              updateField("current_status", value);
              if (value !== "Other") {
                updateField("current_status_other", "");
              }
            }}
          >
            <SelectTrigger className={errors.current_status ? "border-destructive" : ""}>
              <SelectValue placeholder="Select your current status" />
            </SelectTrigger>
            <SelectContent>
              {CURRENT_STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.current_status && (
            <p className="text-xs text-destructive">{errors.current_status}</p>
          )}
        </div>

        {/* Other Status Input */}
        {showOtherInput && (
          <div className="space-y-2 pl-4 border-l-2 border-primary/20">
            <Label htmlFor="current_status_other">
              Please specify <span className="text-destructive">*</span>
            </Label>
            <Input
              id="current_status_other"
              type="text"
              placeholder="Describe your current status"
              value={formData.current_status_other || ""}
              onChange={(e) => updateField("current_status_other", e.target.value)}
              className={errors.current_status_other ? "border-destructive" : ""}
            />
            {errors.current_status_other && (
              <p className="text-xs text-destructive">{errors.current_status_other}</p>
            )}
          </div>
        )}

        {/* LinkedIn */}
        <div className="space-y-2">
          <Label htmlFor="linkedin">
            LinkedIn Profile URL
            <span className="text-muted-foreground text-xs ml-2">(optional)</span>
          </Label>
          <Input
            id="linkedin"
            type="url"
            placeholder="https://linkedin.com/in/yourprofile"
            value={formData.linkedin || ""}
            onChange={(e) => updateField("linkedin", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Share your complete LinkedIn URL to connect with instructors and peers.
          </p>
        </div>
      </div>
    </div>
  );
}
