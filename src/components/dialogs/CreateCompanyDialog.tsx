import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
  company?: any;
}

export default function CreateCompanyDialog({ open, onOpenChange, onCreated, company }: Props) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: company?.name || "",
    plan: company?.plan || "Starter",
    status: company?.status || "Active",
    user_count: company?.user_count || 0,
  });

  const handleSave = async () => {
    if (!form.name) {
      toast.error("Company name is required");
      return;
    }
    setSaving(true);
    let error;
    if (company) {
      ({ error } = await supabase.from("companies").update(form).eq("id", company.id));
    } else {
      ({ error } = await supabase.from("companies").insert(form));
    }
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success(company ? "Company updated" : "Company added");
      onOpenChange(false);
      onCreated();
    }
  };

  const set = (key: string, value: string | number) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{company ? "Edit Company" : "Add Company"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div><Label>Company Name</Label><Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Acme Inc" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Plan</Label>
              <select value={form.plan} onChange={(e) => set("plan", e.target.value)} className="w-full h-10 px-3 text-sm bg-background border border-input rounded-md">
                <option>Starter</option><option>Professional</option><option>Enterprise</option>
              </select>
            </div>
            <div><Label>Status</Label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)} className="w-full h-10 px-3 text-sm bg-background border border-input rounded-md">
                <option>Active</option><option>Inactive</option><option>Suspended</option>
              </select>
            </div>
          </div>
          <div><Label>User Count</Label><Input type="number" value={form.user_count} onChange={(e) => set("user_count", Number(e.target.value))} /></div>
        </div>
        <DialogFooter>
          <button onClick={() => onOpenChange(false)} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm rounded-lg gradient-primary text-primary-foreground font-medium disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : company ? "Update" : "Add"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
