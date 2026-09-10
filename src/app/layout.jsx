import { Poppins } from 'next/font/google';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata = {
  title: 'CodeTask | Learning & Analytics Platform',
  description:
    'Assignment and learning analytics system for instructors and students',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${poppins.className} min-h-screen bg-base-100 text-neutral-content antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
