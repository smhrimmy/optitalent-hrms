import Link from 'next/link';

export const metadata = { title: 'Privacy Policy' };

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-2xl px-6 py-16 space-y-4">
      <h1 className="text-3xl">Privacy Policy</h1>
      <p className="text-sm text-muted-foreground">Last updated 22 August 2026. OptiTalent processes employee personal data as a processor for each tenant.</p>
      <p>We collect account email, name, attendance, leave, payroll, and documents you upload. Data stays in the tenant boundary (RLS). Demo mode stores records in your browser only.</p>
      <p>Retention: active employees for the life of the tenant; leavers 7 years for payroll compliance unless a deletion request is honoured sooner.</p>
      <p>To export or delete your data, email privacy@optitalent.com with your employee ID. <Link href="/terms" className="underline">Terms</Link> · <Link href="/cookies" className="underline">Cookies</Link></p>
    </article>
  );
}
