import { Fraunces, Source_Sans_3, IBM_Plex_Mono } from 'next/font/google';

export const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-sans',
});

export const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
});

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ibm-plex-mono',
  weight: ['400', '500'],
});
