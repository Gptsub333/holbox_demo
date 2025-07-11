// app/layout.jsx
import "./globals.css";
import ClientProviders from "../components/ClientProviders"; // plain import!

export const metadata = {
  title: "Agentic AI Demo Interface",
  description: "Premium AI features showcase with modern design",
  generator: "Holbox.ai.dev",
  icons: "/holboxai.svg"
};

export default async function RootLayout({ children }) {
  // Get subdomain from headers

  return (
    <html lang="en">
      <body>
        <ClientProviders >
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
