// app/layout.jsx
import "./globals.css";
import ClientProviders from "../components/ClientProviders"; // plain import!
import { Toaster } from "@/components/ui/sonner"
import { Neuton } from 'next/font/google';

const neuton = Neuton({ subsets: ['latin'], weight: ['200', '300', '400', '700', '800'], display: 'swap' });

export const metadata = {
  title: "Agentic AI Demo Interface",
  description: "Premium AI features showcase with modern design",
  generator: "Mach11",
  icons: "/mach11.svg"
};

export default async function RootLayout({ children }) {
  // Get subdomain from headers

  return (
    <html lang="en">
      <body className={neuton.className}>
        <ClientProviders>
          {children}
          <Toaster />
        </ClientProviders>
      </body>
    </html>
  );
}
