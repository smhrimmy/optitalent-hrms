import { Fraunces, Source_Sans_3 } from 'next/font/google';

export const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-source-sans',
  weight: ['400', '500', '600', '700'],
});

export const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  weight: ['500', '600', '700'],
});

/** @deprecated use sourceSans */
export const poppins = sourceSans;
/** @deprecated use fraunces */
export const spaceGrotesk = fraunces;
