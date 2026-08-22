import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import { sourceSans, fraunces } from "@/lib/fonts"
import ClientLayout from './client-layout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://optitalent.example'),
  title: {
    default: 'OptiTalent — Hire to retire in one people system',
    template: '%s · OptiTalent',
  },
  description: 'OptiTalent runs employee records, attendance, leave, payroll, hiring, and manager approvals from a single tenant-isolated database.',
  openGraph: {
    title: 'OptiTalent HRMS',
    description: 'People operations from hire to exit — leave, payroll, ATS, and self-service.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OptiTalent HRMS',
    description: 'People operations from hire to exit — leave, payroll, ATS, and self-service.',
  },
  icons: [{ rel: 'icon', url: '/favicon.svg' }],
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${sourceSans.variable} ${fraunces.variable} font-body antialiased overflow-x-hidden`}
        suppressHydrationWarning
      >
        <ClientLayout>
          {children}
        </ClientLayout>
        <Toaster />
      </body>
    </html>
  );
}
