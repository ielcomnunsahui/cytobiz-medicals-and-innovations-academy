import { useState } from "react";
import { motion, Reorder, useDragControls } from "framer-motion";
import {
  Plus,
  Trash2,
  GripVertical,
  Save,
  Loader2,
  Settings,
  Type,
  Mail,
  Phone,
  Hash,
  AlignLeft,
  ListChecks,
  CheckSquare,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export type FieldType = "text" | "textarea" | "email" | "phone" | "number" | "select" | "multiselect" | "checkbox";

export interface FormField {
  id: string;
  field_key: string;
  field_type: FieldType;
  label: string;
  placeholder?: string;
  help_text?: string;
  required: boolean;
  options?: string[];
  order_index: number;
}

interface FormBuilderProps {
  fields: FormField[];
  onChange: (fields: FormField[]) => void;
  onSave: () => void;
  isSaving?: boolean;
}

const fieldTypeIcons: Record<FieldType, React.ReactNode> = {
  text: <Type className="w-4 h-4" />,
  textarea: <AlignLeft className="w-4 h-4" />,
  email: <Mail className="w-4 h-4" />,
  phone: <Phone className="w-4 h-4" />,
  number: <Hash className="w-4 h-4" />,
  select: <ListChecks className="w-4 h-4" />,
  multiselect: <ListChecks className="w-4 h-4" />,
  checkbox: <CheckSquare className="w-4 h-4" />,
};

const fieldTypeLabels: Record<FieldType, string> = {
  text: "Text Input",
  textarea: "Text Area",
  email: "Email",
  phone: "Phone",
  number: "Number",
  select: "Dropdown",
  multiselect: "Multi-Select",
  checkbox: "Checkbox",
};

function FieldCard({
  field,
  onUpdate,
  onRemove,
}: {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
  onRemove: () => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const dragControls = useDragControls();

  const needsOptions = ["select", "multiselect"].includes(field.field_type);

  return (
    <Reorder.Item
      value={field}
      dragListener={false}
      dragControls={dragControls}
      className="mb-3"
    >
      <Card className="border border-border bg-card">
        <CardHeader className="p-4 pb-3">
          <div className="flex items-center gap-3">
            <button
              onPointerDown={(e) => dragControls.start(e)}
              className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
            >
              <GripVertical className="w-5 h-5" />
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="gap-1">
                  {fieldTypeIcons[field.field_type]}
                  {fieldTypeLabels[field.field_type]}
                </Badge>
                {field.required && (
                  <Badge variant="secondary" className="text-xs">Required</Badge>
                )}
              </div>
              <div className="font-medium mt-1 truncate">{field.label || "Untitled Field"}</div>
              <div className="text-xs text-muted-foreground font-mono">{field.field_key}</div>
            </div>

            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>

            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              onClick={onRemove}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleContent>
            <Separator />
            <CardContent className="p-4 space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Label</Label>
                  <Input
                    value={field.label}
                    onChange={(e) => onUpdate({ label: e.target.value })}
                    placeholder="Field label"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Field Key</Label>
                  <Input
                    value={field.field_key}
                    onChange={(e) => onUpdate({ field_key: e.target.value.toLowerCase().replace(/\s+/g, "_") })}
                    placeholder="field_key"
                    className="font-mono text-sm"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Field Type</Label>
                  <Select
                    value={field.field_type}
                    onValueChange={(v) => onUpdate({ field_type: v as FieldType })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(fieldTypeLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          <div className="flex items-center gap-2">
                            {fieldTypeIcons[value as FieldType]}
                            {label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Placeholder</Label>
                  <Input
                    value={field.placeholder || ""}
                    onChange={(e) => onUpdate({ placeholder: e.target.value })}
                    placeholder="Placeholder text"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Help Text</Label>
                <Input
                  value={field.help_text || ""}
                  onChange={(e) => onUpdate({ help_text: e.target.value })}
                  placeholder="Additional instructions for this field"
                />
              </div>

              {needsOptions && (
                <div className="space-y-2">
                  <Label>Options (one per line)</Label>
                  <Textarea
                    value={field.options?.join("\n") || ""}
                    onChange={(e) => onUpdate({ options: e.target.value.split("\n").filter(Boolean) })}
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                    rows={4}
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <Switch
                  checked={field.required}
                  onCheckedChange={(checked) => onUpdate({ required: checked })}
                />
                <Label>Required field</Label>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </Reorder.Item>
  );
}

export function FormBuilder({ fields, onChange, onSave, isSaving }: FormBuilderProps) {
  const handleReorder = (newOrder: FormField[]) => {
    const reindexed = newOrder.map((field, index) => ({
      ...field,
      order_index: index,
    }));
    onChange(reindexed);
  };

  const addField = () => {
    const newField: FormField = {
      id: crypto.randomUUID(),
      field_key: `field_${fields.length + 1}`,
      field_type: "text",
      label: "New Field",
      required: false,
      order_index: fields.length,
    };
    onChange([...fields, newField]);
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    onChange(fields.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const removeField = (id: string) => {
    onChange(fields.filter((f) => f.id !== id).map((f, i) => ({ ...f, order_index: i })));
  };

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-12 text-center">
            <Settings className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium text-foreground mb-2">No fields yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add fields to create your registration form
            </p>
            <Button onClick={addField}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Field
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Reorder.Group values={fields} onReorder={handleReorder} className="space-y-0">
          {fields.map((field) => (
            <FieldCard
              key={field.id}
              field={field}
              onUpdate={(updates) => updateField(field.id, updates)}
              onRemove={() => removeField(field.id)}
            />
          ))}
        </Reorder.Group>
      )}

      <div className="flex items-center gap-3 pt-4">
        <Button variant="outline" onClick={addField} className="flex-1">
          <Plus className="w-4 h-4 mr-2" />
          Add Field
        </Button>
        <Button onClick={onSave} disabled={isSaving} className="flex-1">
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Form
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
