'use client';
import { RecordsBoard } from '@/components/records-board';

export default function Page() {
  return (
    <RecordsBoard
      title="Timesheets"
      description="Hours against a project code."
      storeKey="ot_timesheets"
      createLabel="Log hours"
      seed={[{ id: 't1', project: 'Walk-in drive', hours: '6', date: '2026-08-21', person: 'Demo user' }]}
      fields={[
        { key: 'project', label: 'Project' },
        { key: 'hours', label: 'Hours', type: 'number' },
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'person', label: 'Person' },
      ]}
    />
  );
}
