'use client';

import { useEffect, useState } from 'react';
import { hydrateAudit, listAudit } from '@/engines/audit';
import { OsHeader } from '@/components/workforce/os-header';
import { Badge } from '@/components/ui/badge';

export default function AuditPage() {
  const [rows, setRows] = useState(listAudit());
  useEffect(() => {
    hydrateAudit();
    setRows(listAudit());
  }, []);

  return (
    <div className="space-y-6">
      <OsHeader
        kicker="Audit"
        title="Every important mutation is a record"
        lede="User, role, entity, before/after, reason, source. AI actions are marked source=ai. Denied salary lookups show up here too."
      />
      <div className="rounded-md border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3">When</th>
              <th className="p-3">Who</th>
              <th className="p-3">Action</th>
              <th className="p-3">Record</th>
              <th className="p-3">Source</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="p-3 text-muted-foreground" colSpan={5}>
                  No audited events yet. Clock in, run the Chief of Staff, or ask for a salary you cannot see.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3 whitespace-nowrap">{r.at.slice(0, 19).replace('T', ' ')}</td>
                  <td className="p-3">
                    {r.user} · {r.role}
                  </td>
                  <td className="p-3">
                    {r.action} {r.entity}
                    {r.after ? <p className="text-xs text-muted-foreground">{r.after}</p> : null}
                  </td>
                  <td className="p-3">{r.record}</td>
                  <td className="p-3">
                    <Badge variant={r.source === 'ai' ? 'secondary' : 'outline'}>{r.source}</Badge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
