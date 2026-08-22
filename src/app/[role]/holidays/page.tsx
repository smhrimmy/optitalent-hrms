'use client';
import { RecordsBoard } from '@/components/records-board';

export default function Page() {
  return (
    <RecordsBoard
      title="Holiday calendar"
      description="Company holidays used when reading leave. Attendance engines do not auto-skip these yet."
      storeKey="ot_holidays"
      createLabel="Add holiday"
      seed={[{ id: 'h1', name: 'Independence Day', date: '2026-08-15', region: 'IN' }]}
      fields={[
        { key: 'name', label: 'Name' },
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'region', label: 'Region' },
      ]}
    />
  );
}
