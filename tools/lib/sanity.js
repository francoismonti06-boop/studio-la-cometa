import { createClient } from "@sanity/client";

function getProjectId() {
  return (
    process.env.SANITY_STUDIO_PROJECT_ID ||
    process.env.SANITY_PROJECT_ID ||
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  );
}

function getDataset() {
  return (
    process.env.SANITY_STUDIO_DATASET ||
    process.env.SANITY_DATASET ||
    process.env.NEXT_PUBLIC_SANITY_DATASET ||
    "production"
  );
}

export function assertSanityConfig({ write = false } = {}) {
  const projectId = getProjectId();

  if (!projectId) {
    throw new Error(
      "Missing Sanity projectId. Set SANITY_PROJECT_ID or SANITY_STUDIO_PROJECT_ID.",
    );
  }

  if (write && !process.env.SANITY_API_TOKEN) {
    throw new Error("Missing SANITY_API_TOKEN. Required for --write.");
  }
}

export function getSanityClient({ write = false } = {}) {
  assertSanityConfig({ write });

  return createClient({
    projectId: getProjectId(),
    dataset: getDataset(),
    apiVersion: "2025-01-01",
    token:
    process.env.SANITY_API_TOKEN ||
    process.env.SANITY_AUTH_TOKEN,
    useCdn: false,
  });
}