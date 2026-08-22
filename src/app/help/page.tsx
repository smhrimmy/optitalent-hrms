import { LegalDoc } from '@/components/legal-doc';
import Link from 'next/link';

export default function HelpPage() {
  return (
    <LegalDoc title="Help">
      <ol>
        <li>Sign in with a work email or a demo account (`admin@optitalent.com` / `password123`).</li>
        <li>Use the sidebar or press ⌘K to open people, leave, payroll, hiring, or tickets.</li>
        <li>Clock in from Attendance. Apply leave from Leaves. Hire from Recruitment.</li>
      </ol>
      <p>
        Still stuck? <Link href="/contact">Contact</Link> or email support@optitalent.com.
      </p>
    </LegalDoc>
  );
}
