import type { NextConfig } from "next";

// The campaign export is served under a subpath. Dev and Vercel serve the
// app at the site root so assets resolve.
const campaignBasePath = "/3Care/eng/gamify/candy-crush";
const basePath =
  process.env.VERCEL || process.env.NODE_ENV !== "production"
    ? ""
    : campaignBasePath;

const nextConfig: NextConfig = {
  output: "export",
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
