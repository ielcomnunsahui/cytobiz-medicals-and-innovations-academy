import { useState } from "react";
import { format } from "date-fns";
import {
  Plus,
  Percent,
  DollarSign,
  Trash2,
  Edit,
  Copy,
  Check,
  Tag,
  Calendar,
  Users,
  AlertCircle,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

import {
  useDiscountCodes,
  useCreateDiscountCode,
  useUpdateDiscountCode,
  useDeleteDiscountCode,
  DiscountCode,
} from "@/hooks/useDiscountCodes";
import { useCourses } from "@/hooks/useCourses";

const emptyForm: Partial<DiscountCode> = {
  code: "",
  description: "",
  discount_type: "percentage",
  discount_value: 10,
  max_uses: null,
  min_purchase_amount: null,
  course_id: null,
  is_active: true,
  valid_from: new Date().toISOString(),
  valid_until: null,
};

export default function AdminDiscountCodes() {
  const { data: discountCodes, isLoading } = useDiscountCodes();
  const { data: courses } = useCourses();
  const createMutation = useCreateDiscountCode();
  const updateMutation = useUpdateDiscountCode();
  const deleteMutation = useDeleteDiscountCode();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null);
  const [formData, setFormData] = useState<Partial<DiscountCode>>(emptyForm);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setEditingCode(null);
    setFormData(emptyForm);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (code: DiscountCode) => {
    setEditingCode(code);
    setFormData({
      code: code.code,
      description: code.description || "",
      discount_type: code.discount_type,
      discount_value: code.discount_value,
      max_uses: code.max_uses,
      min_purchase_amount: code.min_purchase_amount,
      course_id: code.course_id,
      is_active: code.is_active,
      valid_from: code.valid_from,
      valid_until: code.valid_until,
    });
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.code?.trim()) {
      toast.error("Please enter a discount code");
      return;
    }
    if (!formData.discount_value || formData.discount_value <= 0) {
      toast.error("Please enter a valid discount value");
      return;
    }

    if (editingCode) {
      await updateMutation.mutateAsync({ id: editingCode.id, ...formData });
    } else {
      await createMutation.mutateAsync(formData);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = async () => {
    if (deletingId) {
      await deleteMutation.mutateAsync(deletingId);
      setDeletingId(null);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Code copied to clipboard");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getStatusBadge = (code: DiscountCode) => {
    if (!code.is_active) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    const now = new Date();
    if (code.valid_until && new Date(code.valid_until) < now) {
      return <Badge variant="destructive">Expired</Badge>;
    }
    if (code.max_uses && code.current_uses >= code.max_uses) {
      return <Badge variant="secondary">Used Up</Badge>;
    }
    return <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Discount Codes</h1>
            <p className="text-muted-foreground">
              Create and manage promotional discount codes
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="w-4 h-4" />
            Create Code
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Codes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{discountCodes?.length || 0}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Codes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {discountCodes?.filter((c) => c.is_active).length || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Redemptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {discountCodes?.reduce((sum, c) => sum + c.current_uses, 0) || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Codes Table */}
        <Card>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : discountCodes?.length === 0 ? (
              <div className="p-12 text-center">
                <Tag className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium text-foreground mb-2">No discount codes</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create your first promotional code to offer discounts
                </p>
                <Button onClick={handleOpenCreate}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Code
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Discount</TableHead>
                    <TableHead>Usage</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discountCodes?.map((code) => (
                    <TableRow key={code.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="font-mono font-bold text-primary">
                            {code.code}
                          </code>
                          <button
                            onClick={() => copyCode(code.code)}
                            className="text-muted-foreground hover:text-foreground"
                          >
                            {copiedCode === code.code ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                        {code.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {code.description}
                          </p>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {code.discount_type === "percentage" ? (
                            <>
                              <Percent className="w-4 h-4 text-muted-foreground" />
                              <span className="font-medium">{code.discount_value}%</span>
                            </>
                          ) : (
                            <>
                              <span className="font-medium">₦{code.discount_value.toLocaleString()}</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span>{code.current_uses}</span>
                          {code.max_uses && (
                            <span className="text-muted-foreground">/ {code.max_uses}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {code.course ? (
                          <span className="text-sm">{code.course.title}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">All courses</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(code)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(code)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeletingId(code.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCode ? "Edit Discount Code" : "Create Discount Code"}
            </DialogTitle>
            <DialogDescription>
              {editingCode
                ? "Update the discount code settings"
                : "Create a new promotional discount code"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Code */}
            <div className="space-y-2">
              <Label htmlFor="code">
                Code <span className="text-destructive">*</span>
              </Label>
              <Input
                id="code"
                placeholder="e.g., SAVE20"
                value={formData.code || ""}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value.toUpperCase() })
                }
                className="font-mono uppercase"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Internal note about this code"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={2}
              />
            </div>

            {/* Discount Type & Value */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount Type</Label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(value: "percentage" | "fixed") =>
                    setFormData({ ...formData, discount_type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount (₦)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount_value">
                  Value <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="discount_value"
                  type="number"
                  min={0}
                  value={formData.discount_value || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      discount_value: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>

            {/* Course Restriction */}
            <div className="space-y-2">
              <Label>Restrict to Course</Label>
              <Select
                value={formData.course_id || "all"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    course_id: value === "all" ? null : value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All courses</SelectItem>
                  {courses?.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Usage Limits */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max_uses">Max Uses</Label>
                <Input
                  id="max_uses"
                  type="number"
                  min={0}
                  placeholder="Unlimited"
                  value={formData.max_uses || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      max_uses: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="min_purchase">Min Purchase (₦)</Label>
                <Input
                  id="min_purchase"
                  type="number"
                  min={0}
                  placeholder="None"
                  value={formData.min_purchase_amount || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      min_purchase_amount: e.target.value
                        ? parseFloat(e.target.value)
                        : null,
                    })
                  }
                />
              </div>
            </div>

            {/* Validity Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="valid_from">Valid From</Label>
                <Input
                  id="valid_from"
                  type="date"
                  value={
                    formData.valid_from
                      ? format(new Date(formData.valid_from), "yyyy-MM-dd")
                      : ""
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      valid_from: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : undefined,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valid_until">Valid Until</Label>
                <Input
                  id="valid_until"
                  type="date"
                  value={
                    formData.valid_until
                      ? format(new Date(formData.valid_until), "yyyy-MM-dd")
                      : ""
                  }
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      valid_until: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : null,
                    })
                  }
                />
              </div>
            </div>

            {/* Active Switch */}
            <div className="flex items-center justify-between">
              <Label htmlFor="is_active">Active</Label>
              <Switch
                id="is_active"
                checked={formData.is_active ?? true}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, is_active: checked })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {editingCode ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Discount Code?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this discount code. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
