// app/layout.tsx
import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google'; 
import './globals.css';

// Configure Playfair Display
const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair', // Optional: for use in tailwind.config
});

export const metadata: Metadata = {
  title: 'Interior Design Gallery',
  description: 'Sophisticated interior design projects',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Applying the font class to the body tag makes it the global default */}
      <body className={`${playfair.className} bg-[#F9FAFB] text-gray-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}