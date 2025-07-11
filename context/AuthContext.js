'use client';
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [sessionToken, setSessionToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      if (isLoaded && isSignedIn) {
        const token = await getToken();
        setSessionToken(token);
      }
    };
    fetchToken();
  }, [isLoaded, isSignedIn, getToken]);

  return (
    <AuthContext.Provider value={{ sessionToken, isLoaded, isSignedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
