import dotenv from "dotenv";
import { createClient } from "@sanity/client";

dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId: "04fmwf9v",
  dataset: "production",
  apiVersion: "2025-01-01",
  token: process.env.SANITY_API_TOKEN || process.env.SANITY_AUTH_TOKEN,
  useCdn: false,
});

const doc = await client.fetch('*[_type == "contactPage"][0]');

console.dir(doc, { depth: 12 });