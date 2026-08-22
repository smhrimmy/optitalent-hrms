'use client';

import { useEffect, useState } from 'react';
import { readAudit, type AuditEvent } from '@/lib/audit';

export default function AuditPage() {
  const [rows, setRows] = useState<AuditEvent[]>([]);
  useEffect(() => setRows(readAudit()), []);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-headline font-semibold">Audit log</h1>
      <p className="text-muted-foreground text-sm">
        Sensitive UI actions on this device. Not a server-side SIEM.
      </p>
      <div className="overflow-x-auto border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 text-left">
              <th className="p-3">When</th>
              <th className="p-3">Actor</th>
              <th className="p-3">Action</th>
              <th className="p-3">Detail</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="p-3 text-muted-foreground" colSpan={4}>
                  No events yet. Change a security setting or add a record.
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="p-3 font-code text-xs">{r.at}</td>
                  <td className="p-3">{r.actor}</td>
                  <td className="p-3">{r.action}</td>
                  <td className="p-3 truncate max-w-xs">{r.detail}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
