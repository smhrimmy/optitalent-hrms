import Link from 'next/link';

export const metadata = { title: 'Cookie Policy' };

export default function CookiesPage() {
  return (
    <article className="mx-auto max-w-2xl px-6 py-16 space-y-4">
      <h1 className="text-3xl">Cookie Policy</h1>
      <p>Necessary: session cookie after sign-in. Functional: theme, feature flags, and demo HR data in localStorage. Analytics cookies are off unless you choose Accept on the banner.</p>
      <p><Link href="/privacy" className="underline">Privacy</Link></p>
    </article>
  );
}
