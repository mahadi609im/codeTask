import { Poppins } from 'next/font/google';
import './globals.css';
import NextAuthProvider from './provider/NextAuthProvider';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata = {
  metadataBase: new URL('https://codetask-two.vercel.app'),

  title: {
    default: 'CodeTask | Assignment & Learning Analytics Platform',
    template: '%s | CodeTask',
  },

  description:
    'CodeTask is an assignment and learning analytics platform for instructors and students to manage assignments, review submissions, track progress, provide feedback, and analyze learning performance.',

  keywords: [
    'CodeTask',
    'assignment management',
    'learning analytics',
    'student dashboard',
    'instructor dashboard',
    'assignment tracking',
    'submission management',
    'AI feedback',
    'learning platform',
    'Next.js',
  ],

  authors: [{ name: 'Mahadi Hasan Milon' }],
  creator: 'Mahadi Hasan Milon',
  publisher: 'Mahadi Hasan Milon',

  alternates: {
    canonical: 'https://codetask-two.vercel.app',
  },

  openGraph: {
    title: 'CodeTask | Assignment & Learning Analytics Platform',
    description:
      'Manage assignments, review submissions, track student progress, provide feedback, and analyze learning performance with CodeTask.',
    url: 'https://codetask-two.vercel.app',
    siteName: 'CodeTask',
    images: [
      {
        url: 'https://i.ibb.co.com/mr1ssgpy/db46c95e-0e5b-4c7a-820f-ba0579da3035.png',
        width: 1200,
        height: 630,
        alt: 'CodeTask Assignment & Learning Analytics Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'CodeTask | Assignment & Learning Analytics Platform',
    description:
      'A modern platform for assignment management, student submissions, feedback, and learning analytics.',
    images: [
      'https://i.ibb.co.com/mr1ssgpy/db46c95e-0e5b-4c7a-820f-ba0579da3035.png',
    ],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <NextAuthProvider>
      <html lang="en" className="dark">
        <body
          className={`${poppins.className} min-h-screen bg-base-100 text-neutral-content antialiased`}
        >
          {children}
        </body>
      </html>
    </NextAuthProvider>
  );
}
