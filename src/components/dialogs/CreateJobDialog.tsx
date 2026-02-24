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
  job?: any; // if provided, we're editing
}

export default function CreateJobDialog({ open, onOpenChange, onCreated, job }: Props) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: job?.title || "",
    department: job?.department || "",
    location: job?.location || "Remote",
    experience_level: job?.experience_level || "Mid-Level",
    description: job?.description || "",
    status: job?.status || "Open",
  });

  const handleSave = async () => {
    if (!form.title || !form.department) {
      toast.error("Title and department are required");
      return;
    }
    setSaving(true);
    const payload = { ...form };
    let error;
    if (job) {
      ({ error } = await supabase.from("job_listings").update(payload).eq("id", job.id));
    } else {
      ({ error } = await supabase.from("job_listings").insert(payload));
    }
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success(job ? "Job updated" : "Job created");
      onOpenChange(false);
      onCreated();
    }
  };

  const set = (key: string, value: string) => setForm((p) => ({ ...p, [key]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{job ? "Edit Job Listing" : "Create Job Listing"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div><Label>Title</Label><Input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Senior Engineer" /></div>
          <div><Label>Department</Label><Input value={form.department} onChange={(e) => set("department", e.target.value)} placeholder="e.g. Engineering" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Location</Label><Input value={form.location} onChange={(e) => set("location", e.target.value)} /></div>
            <div><Label>Experience</Label><Input value={form.experience_level} onChange={(e) => set("experience_level", e.target.value)} /></div>
          </div>
          <div><Label>Description</Label><textarea value={form.description} onChange={(e) => set("description", e.target.value)} className="w-full min-h-[80px] px-3 py-2 text-sm bg-background border border-input rounded-md" placeholder="Job description..." /></div>
          <div><Label>Status</Label>
            <select value={form.status} onChange={(e) => set("status", e.target.value)} className="w-full h-10 px-3 text-sm bg-background border border-input rounded-md">
              <option>Open</option><option>On Hold</option><option>Closed</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <button onClick={() => onOpenChange(false)} className="px-4 py-2 text-sm rounded-lg border border-border hover:bg-muted">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-2 text-sm rounded-lg gradient-info text-info-foreground font-medium disabled:opacity-50">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : job ? "Update" : "Create"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
