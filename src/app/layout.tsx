import './globals.css'
import { Toaster } from "@/components/ui/toaster"
import { sourceSans, fraunces } from "@/lib/fonts"
import ClientLayout from './client-layout'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://optitalent.example'),
  title: {
    default: 'OptiTalent — AI Workforce Operating System',
    template: '%s · OptiTalent',
  },
  description: 'Understand what is happening in the workforce, explain why, predict what happens next, recommend the action, and execute it — on one employee graph.',
  openGraph: {
    title: 'OptiTalent Workforce OS',
    description: 'Digital twin, why engine, simulator, and HR Chief of Staff — not another HRMS module pack.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OptiTalent Workforce OS',
    description: 'Digital twin, why engine, simulator, and HR Chief of Staff — not another HRMS module pack.',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'OptiTalent',
              applicationCategory: 'BusinessApplication',
              description:
                'Adaptive workforce intelligence OS. Company DNA generates the HRMS; intelligence explains why and agents execute with audit.',
            }),
          }}
        />
        <ClientLayout>
          {children}
        </ClientLayout>
        <Toaster />
      </body>
    </html>
  );
}
