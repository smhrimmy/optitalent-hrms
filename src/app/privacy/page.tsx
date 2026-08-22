import { LegalDoc } from '@/components/legal-doc';

export default function PrivacyPage() {
  return (
    <LegalDoc title="Privacy notice">
      <p>
        OptiTalent stores employee records (name, email, attendance, leave, payroll metadata, tickets) so HR can run
        the workforce. Data lives in the tenant&apos;s Supabase project. We do not sell people data.
      </p>
      <p>
        Retention: active tenant data stays until the tenant is deleted. Soft-deleted rows remain until a hard purge
        by an operator. Demo @optitalent.com accounts may be reset at any time.
      </p>
      <p>
        Rights: email privacy@optitalent.com from the account address to export or delete your user. HR handles
        employee-file requests for the company.
      </p>
      <p>Last updated 22 August 2026.</p>
    </LegalDoc>
  );
}
