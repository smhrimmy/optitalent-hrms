'use client';
import { RecordsBoard } from '@/components/records-board';

export default function Page() {
  return (
    <RecordsBoard
      title="Offboarding"
      description="Resignations and clearance. Access revocation is a checklist, not an IdP call."
      storeKey="ot_offboarding"
      createLabel="Add case"
      seed={[{ id: 'o1', name: 'Former contractor', lastDay: '2026-09-01', assets: 'Laptop due', status: 'Notice' }]}
      fields={[
        { key: 'name', label: 'Person' },
        { key: 'lastDay', label: 'Last day', type: 'date' },
        { key: 'assets', label: 'Assets' },
        { key: 'status', label: 'Status' },
      ]}
    />
  );
}
