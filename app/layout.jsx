// app/layout.jsx
import "./globals.css";
import { headers } from "next/headers";
import { getSubdomain } from "../utils/getSubdomain";
import ClientProviders from "../components/ClientProviders"; // plain import!

export const metadata = {
  title: "Agentic AI Demo Interface",
  description: "Premium AI features showcase with modern design",
  generator: "Holbox.ai.dev",
  icons: "/holboxai.svg"
};

export default async function RootLayout({ children }) {
  // Get subdomain from headers
const headersList = await headers();
const host = headersList.get("host") || "";

  let subdomain = getSubdomain(host);

  if (!subdomain && (host.startsWith("localhost") || host.startsWith("10.7.1.44"))) {
    subdomain = "demo";
  }

  // Fetch organization data
  let organization = null;
  if (subdomain) {
    try {
      const res = await fetch(
        `${process.env.BACKEND_URL}/api/organization/by-subdomain/${subdomain}`,
        { cache: "no-store" }
      );
      if (res.ok) organization = await res.json();
    } catch {
      organization = null;
    }
  }

  return (
    <html lang="en">
      <body>
        <ClientProviders organization={organization}>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
