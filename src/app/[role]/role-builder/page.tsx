'use client';

import { useState } from 'react';
import { useDataQuery } from '@/hooks/use-dataquery';
import { dataQuery } from '@/lib/dataquery';
import { PROFILE_FIELDS, type AccessRole, type FieldAccess, type FieldId } from '@/lib/company-blueprint';
import { OsHeader } from '@/components/workforce/os-header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RoleBuilderPage() {
  const db = useDataQuery();
  const roles = db.company.roles;
  const [id, setId] = useState(roles[0]?.id);
  const role = roles.find((r) => r.id === id) || roles[0];
  const [draft, setDraft] = useState<AccessRole | null>(null);
  const current = draft && draft.id === role?.id ? draft : role;

  if (!current) return null;

  const setField = (field: FieldId, access: FieldAccess) => {
    setDraft({ ...current, fields: { ...current.fields, [field]: access } });
  };

  return (
    <div className="space-y-6">
      <OsHeader
        kicker="Role + scope + field permissions"
        title="Not just Admin / HR / Employee"
        lede="A store manager sees one store, no salary, no payroll. Regional HR sees South India. Payroll edits bank and tax. Rules follow the record into reports — this builder is the source."
      />
      <div className="flex flex-wrap gap-2">
        {roles.map((r) => (
          <Button key={r.id} size="sm" variant={r.id === current.id ? 'default' : 'outline'} onClick={() => { setId(r.id); setDraft(null); }}>
            {r.name}
          </Button>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{current.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">{current.description}</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Locations</Label>
                <Input
                  value={current.scope.locations.join(', ')}
                  onChange={(e) => setDraft({ ...current, scope: { ...current.scope, locations: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) } })}
                />
              </div>
              <div>
                <Label>Departments</Label>
                <Input
                  value={current.scope.departments.join(', ')}
                  onChange={(e) => setDraft({ ...current, scope: { ...current.scope, departments: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) } })}
                />
              </div>
              <div>
                <Label>Regions</Label>
                <Input
                  value={current.scope.regions.join(', ')}
                  onChange={(e) => setDraft({ ...current, scope: { ...current.scope, regions: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) } })}
                />
              </div>
              <div>
                <Label>Employment types</Label>
                <Input
                  value={current.scope.workerTypes.join(', ')}
                  onChange={(e) => setDraft({ ...current, scope: { ...current.scope, workerTypes: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) } })}
                />
              </div>
            </div>
            <p className="font-medium pt-2">Module actions</p>
            <div className="overflow-x-auto border rounded-md">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-muted/50 text-left">
                    <th className="p-2">Module</th>
                    {['view', 'create', 'edit', 'delete', 'approve', 'export'].map((a) => (
                      <th key={a} className="p-2 capitalize">{a}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {['core_hr', 'payroll', 'performance', 'leave', 'recruitment', 'attendance'].map((mod) => (
                    <tr key={mod} className="border-t">
                      <td className="p-2 font-medium">{mod}</td>
                      {['view', 'create', 'edit', 'delete', 'approve', 'export'].map((act) => {
                        const on = (current.modules[mod] || current.modules['*'] || []).some((x) => x === act || x === 'manage' || x === '*');
                        return (
                          <td key={act} className="p-2">
                            <input
                              type="checkbox"
                              checked={on}
                              onChange={(e) => {
                                const cur = new Set(current.modules[mod] || []);
                                if (e.target.checked) cur.add(act);
                                else cur.delete(act);
                                setDraft({ ...current, modules: { ...current.modules, [mod]: [...cur] } });
                              }}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button
              onClick={() => {
                dataQuery.saveAccessRole(current);
                setDraft(null);
              }}
            >
              Save role
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Field-level access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {PROFILE_FIELDS.map((f) => (
              <div key={f.id} className="flex items-center justify-between gap-3 border-b py-1">
                <span>{f.label}</span>
                <select
                  className="h-8 rounded-md border bg-background px-2"
                  value={current.fields[f.id]}
                  onChange={(e) => setField(f.id, e.target.value as FieldAccess)}
                >
                  <option value="hidden">Hidden</option>
                  <option value="view">View</option>
                  <option value="edit">Edit</option>
                </select>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Relationship-based access</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-1">
          {db.company.relationships.map((r) => (
            <p key={r}>• {r} can see people linked by that edge — not the whole company.</p>
          ))}
          <p className="pt-2">
            Dynamic rule example: IF role = Store Manager AND user.location = employee.location THEN attendance.approve, leave.approve, shift.manage; DENY payroll, salary, bank.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
