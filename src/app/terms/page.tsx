import { LegalDoc } from '@/components/legal-doc';

export default function TermsPage() {
  return (
    <LegalDoc title="Terms of use">
      <p>
        OptiTalent is an HR workspace. You may only enter data you are authorized to process. Demo accounts
        (@optitalent.com / password123) are for evaluation and may be wiped.
      </p>
      <p>Do not upload malware or other people&apos;s personal data without a lawful basis.</p>
      <p>Minors: this product is for workplace staff. Do not create accounts for people under 16.</p>
    </LegalDoc>
  );
}
