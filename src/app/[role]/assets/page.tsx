'use client';
import { RecordsBoard } from '@/components/records-board';

export default function Page() {
  return (
    <RecordsBoard
      title="Assets"
      description="Laptops and badges assigned to people."
      storeKey="ot_assets"
      createLabel="Assign asset"
      seed={[{ id: 'a1', name: 'MacBook', serial: 'MBP-1042', holder: 'Asha Rao', status: 'Assigned' }]}
      fields={[
        { key: 'name', label: 'Asset' },
        { key: 'serial', label: 'Serial' },
        { key: 'holder', label: 'Holder' },
        { key: 'status', label: 'Status' },
      ]}
    />
  );
}
