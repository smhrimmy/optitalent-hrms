import Link from 'next/link';

export const metadata = { title: 'Terms of Service' };

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-2xl px-6 py-16 space-y-4">
      <h1 className="text-3xl">Terms of Service</h1>
      <p className="text-sm text-muted-foreground">Using OptiTalent means you accept these terms for your organisation.</p>
      <p>Tenants are responsible for lawful payroll, working-time, and data-protection obligations in their country. We provide the software; we are not your employer of record.</p>
      <p>Do not upload CSAM, malware, or data you do not have rights to process. We may suspend tenants that violate this.</p>
      <p><Link href="/privacy" className="underline">Privacy</Link> · <Link href="/login" className="underline">Sign in</Link></p>
    </article>
  );
}
