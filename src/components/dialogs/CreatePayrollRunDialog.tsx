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
}

export default function CreatePayrollRunDialog({ open, onOpenChange, onCreated }: Props) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    run_label: "",
    pay_period_start: "",
    pay_period_end: "",
    total_employees: 0,
    total_amount: 0,
  });

  const handleSave = async () => {
    if (!form.run_label || !form.pay_period_start || !form.pay_period_end) {
      toast.error("Label and pay period dates are required");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("payroll_runs").insert({
      ...form,
      status: "Pending",
    });
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Payroll run created");
      onOpenChange(false);
      onCreated();
    }
  };

  const set = (key: string, value: string | number) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Payroll Run</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div><Label>Run Label</Label><Input value={form.run_label} onChange={(e) => set("run_label", e.target.value)} placeholder="e.g. March 2026 Payroll" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Period Start</Label><Input type="date" value={form.pay_period_start} onChange={(e) => set("pay_period_start", e.target.value)} /></div>
            <div><Label>Period End</Label><Input type="date" value={form.pay_period_end} onChange={(e) => set("pay_period_end", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Total Employees</Label><Input type="number" value={form.total_employees} onChange={(e) => set("total_employees", Number(e.target.value))} /></div>
            <div><Label>Total Amount ($)</Label><Input type="number" value={form.total_amount} onChange={(e) => set("total_amount", Number(e.target.value))} /></div>
          </div>
        </div>
        <DialogFooter>
          <button onClick={() => onOpenChange(false)} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm rounded-lg gradient-primary text-primary-foreground font-medium disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
