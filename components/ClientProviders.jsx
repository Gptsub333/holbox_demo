'use client';

import { ClerkProvider, SignedIn, SignedOut, SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { AuthProvider } from "../context/AuthContext";
import { OrganizationProvider } from "../context/OrganizationContext";
import ClientLayout from "../app/client-layout";

export default function ClientProviders({ children, organization }) {
  const router = useRouter();

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      routerPush={(to) => router.push(to)}
      routerReplace={(to) => router.replace(to)}
    >
      <OrganizationProvider value={organization || {}}>
        <AuthProvider>
          <SignedOut>
            <div className="min-w-screen min-h-screen flex items-center justify-center ">
              <SignIn routing="hash" />
            </div>
          </SignedOut>
          <SignedIn>
            <ClientLayout>{children}</ClientLayout>
          </SignedIn>
        </AuthProvider>
      </OrganizationProvider>
    </ClerkProvider>
  );
}
