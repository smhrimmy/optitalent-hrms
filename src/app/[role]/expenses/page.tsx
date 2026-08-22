'use client';
import { RecordsBoard } from '@/components/records-board';

export default function Page() {
  return (
    <RecordsBoard
      title="Expenses"
      description="Claims for this tenant copy. Receipt files stay on the device you upload from."
      storeKey="ot_expenses"
      createLabel="Add claim"
      seed={[{ id: 'e1', title: 'Client taxi', amount: '420', date: '2026-08-12', status: 'Submitted' }]}
      fields={[
        { key: 'title', label: 'Title' },
        { key: 'amount', label: 'Amount', type: 'number' },
        { key: 'date', label: 'Date', type: 'date' },
        { key: 'status', label: 'Status' },
      ]}
    />
  );
}
