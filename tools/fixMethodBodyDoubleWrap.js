require("dotenv").config({path: ".env.local"})

const {createClient} = require("@sanity/client")

const mode = process.argv.includes("--apply") ? "apply" : "dry-run"

const client = createClient({
  projectId: "04fmwf9v",
  dataset: "production",
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN,
})

async function main() {
  const docs = await client.fetch(`*[_type == "methodPage"]{_id, body}`)

  console.log(`Mode: ${mode}`)
  console.log(`Documents trouvés: ${docs.length}`)

  for (const doc of docs) {
    const candidate = doc.body?.fr?.[0]

    if (candidate?._type !== "localizedRichText") {
      console.log(`- ${doc._id}: rien à corriger`)
      continue
    }

    console.log(`- ${doc._id}: body double-enveloppé détecté`)

    if (mode === "apply") {
      await client.patch(doc._id).set({
        body: candidate,
      }).commit()

      console.log(`  ✅ corrigé`)
    }
  }

  if (mode !== "apply") {
    console.log("")
    console.log("Dry-run uniquement.")
    console.log("Pour appliquer : node tools\\fixMethodBodyDoubleWrap.js --apply")
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})