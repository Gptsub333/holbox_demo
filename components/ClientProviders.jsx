'use client';

import { ClerkProvider, SignedIn, SignedOut, SignIn } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { AuthProvider } from "../context/AuthContext";
import ClientLayout from "../app/client-layout";

export default function ClientProviders({ children }) {
  const router = useRouter();

  return (

    // <ClerkProvider
    //   publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    //   routerPush={(to) => router.push(to)}
    //   routerReplace={(to) => router.replace(to)}
    // >

      
        // {/* <SignedOut> */}
        //   {/* <div className="min-w-screen min-h-screen flex items-center justify-center ">
        //     <SignIn routing="hash" />
        //   </div> */}
        // {/* </SignedOut> */}
        // {/* <SignedIn> */}
        <AuthProvider>
          <ClientLayout>{children}</ClientLayout>
       
      </AuthProvider>
    //   {/* </SignedIn> */}
    // {/* </ClerkProvider> */}

  );
}
