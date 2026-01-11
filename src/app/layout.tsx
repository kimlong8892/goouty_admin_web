import { Outfit } from 'next/font/google';
import './globals.css';
import "flatpickr/dist/flatpickr.css";
import { SidebarProvider } from '@/context/SidebarContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Providers } from '@/components/Providers';

import { Toaster } from 'react-hot-toast';

const outfit = Outfit({
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <Providers>
          <ThemeProvider>
            <Toaster position="top-center" reverseOrder={false} />
            <SidebarProvider>{children}</SidebarProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
