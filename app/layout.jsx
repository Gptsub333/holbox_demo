
import Loader from "../components/Loader"; // Import the Loader component
import ClientLayout from "./client-layout"; // Assuming you have a client layout
import "./globals.css"; // Global CSS
import { ClerkProvider, SignedIn, SignedOut,SignIn } from "@clerk/nextjs"; // Clerk for authentication
import { AuthProvider } from "../context/AuthContext"; // Import the AuthProvider

export const metadata = {
  title: "Agentic AI Demo Interface",
  description: "Premium AI features showcase with modern design",
  generator: "Holbox.ai.dev",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <AuthProvider> 
          <SignedOut>
            <div className="min-w-screen min-h-screen flex items-center justify-center ">
            <SignIn  routing="hash"/>
            </div>
          </SignedOut>
          <SignedIn>
            <ClientLayout>{children}</ClientLayout>
          </SignedIn>
          </AuthProvider>
        </ClerkProvider>

      </body>
    </html>
  );
}
