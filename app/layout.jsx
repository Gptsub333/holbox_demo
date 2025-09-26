// app/layout.jsx
import "./globals.css";
import ClientProviders from "../components/ClientProviders"; // plain import!
import { Toaster } from "@/components/ui/sonner"
import { Space_Grotesk, Poppins, Inter, Roboto, Manrope } from 'next/font/google';

// Inter
const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap' });
// // Poppins
// const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], display: 'swap' });
// // Roboto
// const roboto = Roboto({ subsets: ['latin'], weight: ['400', '500', '700'], display: 'swap' });
// // Manrope
// const manrope = Manrope({ subsets: ['latin'], weight: ['400', '500', '600', '700'], display: 'swap' });
// // Space Grotesk
// const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], weight: ['400', '500', '700'], display: 'swap' });

export const metadata = {
  title: 'Agentic AI Demo Interface',
  description: 'Premium AI features showcase with modern design',
  generator: 'Holbox.ai.dev',
  icons: '/holboxai.svg',
};

export default async function RootLayout({ children }) {
  // Get subdomain from headers

  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientProviders>
          {children}
          <Toaster />
        </ClientProviders>
      </body>
    </html>
  );
}
