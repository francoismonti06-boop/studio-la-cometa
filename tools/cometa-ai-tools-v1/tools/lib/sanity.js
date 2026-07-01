import { createClient } from "@sanity/client";

export const sanity = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || process.env.SANITY_DATASET || "production",
  apiVersion: "2025-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

export function assertSanityConfig({ write }) {
  const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.SANITY_PROJECT_ID;
  if (!projectId) throw new Error("Missing SANITY_PROJECT_ID or SANITY_STUDIO_PROJECT_ID.");
  if (write && !process.env.SANITY_API_TOKEN) throw new Error("Missing SANITY_API_TOKEN. Required for --write.");
}
