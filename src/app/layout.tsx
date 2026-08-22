import './globals.css'
import { sourceSans, fraunces, ibmPlexMono } from "@/lib/fonts"
import ClientLayout from './client-layout'
import { SupabaseBootstrap } from '@/components/supabase-bootstrap'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://optitalent.com'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "OptiTalent — staff records, leave, pay, and hiring",
    template: "%s · OptiTalent",
  },
  description: "Keep one personnel file per person: attendance, leave, payroll, and hiring in a tenant you control.",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
  openGraph: {
    title: "OptiTalent",
    description: "Personnel files, leave, pay, and hiring for one company at a time.",
    url: siteUrl,
    siteName: "OptiTalent",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "OptiTalent",
    description: "Personnel files, leave, pay, and hiring.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sourceSans.variable} ${fraunces.variable} ${ibmPlexMono.variable} font-body antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <SupabaseBootstrap />
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
