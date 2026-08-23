import Link from 'next/link';

export function LegalDoc({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-sm text-muted-foreground">
        <Link href="/" className="underline">
          Home
        </Link>
      </p>
      <h1 className="mt-4 font-headline text-3xl font-semibold">{title}</h1>
      <div className="prose prose-neutral mt-6 max-w-none text-sm leading-relaxed dark:prose-invert">
        {children}
      </div>
    </main>
  );
}
