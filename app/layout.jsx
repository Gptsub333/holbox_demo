import { Suspense } from "react";
import Loader from "../components/Loader"; // Import the Loader component
import ClientLayout from "./client-layout"; // Assuming you have a client layout
import "./globals.css"; // Global CSS

export const metadata = {
  title: "AI Demo Interface",
  description: "Premium AI features showcase with modern design",
  generator: "v0.dev",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={<Loader />}>
          <ClientLayout>{children}</ClientLayout>
        </Suspense>
      </body>
    </html>
  );
}
