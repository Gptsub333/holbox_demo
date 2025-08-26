// 'use client';
// import { createContext, useContext, useState, useEffect } from "react";
// import { useAuth } from "@clerk/nextjs";

// const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const { isLoaded, isSignedIn, getToken } = useAuth();
//   const [sessionToken, setSessionToken] = useState(null);

//   useEffect(() => {
//     const fetchToken = async () => {
//       if (isLoaded && isSignedIn) {
//         const token = await getToken();
//         setSessionToken(token);
//       }
//     };
//     fetchToken();
//   }, [isLoaded, isSignedIn, getToken]);

//   return (
//     <AuthContext.Provider value={{ sessionToken, isLoaded, isSignedIn }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuthContext = () => useContext(AuthContext);

'use client';
import { createContext, useContext, useState, useEffect } from "react";

// Create context for authentication
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Replace with dummy data for local testing
  const isLocal = process.env.NODE_ENV === "development"; // or check another condition for local environment

  const [isLoaded, setIsLoaded] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(true);  // Assume signed in for now
  const [sessionToken, setSessionToken] = useState(""); 

  // If running locally, set dummy sessionToken (bypass Clerk)
  useEffect(() => {
    if (isLocal) {
      setSessionToken("dummy-token-1234"); // Use any dummy value
    }
    // Optionally: you can still fetch the token if needed when not in local environment
  }, [isLocal]);

  return (
    <AuthContext.Provider value={{ sessionToken, isLoaded, isSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
