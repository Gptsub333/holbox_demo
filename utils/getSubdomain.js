export function getSubdomain(host) {
  host = host?.split(":")[0] || "";
  if (!host.endsWith(".holbox.ai")) return null;
   // Add dev support: allow subdomain as a query param or default to 'demo' on localhost
  if (host === "localhost" || host === "10.7.1.44") {
    // For local dev, optionally return a hardcoded org (e.g., "demo") or get from query
    return "demo"; // or dynamically from ?org=org1 in URL
  }
  const parts = host.replace(".holbox.ai", "").split(".");
  if (parts.length === 1 && parts[0] === "holbox") return null;
  return parts.join(".");
}

