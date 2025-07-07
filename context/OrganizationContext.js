"use client";
import { createContext, useContext } from "react";

// DO NOT use "export default"
export const OrganizationContext = createContext({});

export const OrganizationProvider = ({ children, value }) => (
  <OrganizationContext.Provider value={value || {}}>
    {children}
  </OrganizationContext.Provider>
);

export const useOrganization = () => useContext(OrganizationContext);
