require("dotenv").config({path: ".env.local"})

const {createClient} = require("@sanity/client")
const portableTextPaths = require("./portableTextPaths")

const mode = process.argv.includes("--apply") ? "apply" : "dry-run"

const client = createClient({
  projectId: "04fmwf9v",
  dataset: "production",
  apiVersion: "2025-01-01",
  useCdn: false,
  token: process.env.SANITY_AUTH_TOKEN,
})

const TARGET_TYPES = Object.keys(portableTextPaths)

function isLocaleBlock(value) {
  return (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    ("fr" in value || "en" in value)
  )
}

function toLocaleBlock(value) {
  return {
    fr: value,
    en: [],
  }
}

function resolvePathTargets(root, path) {
  const parts = path.split(".")
  const targets = []

  function visit(current, index, concretePath) {
    if (current === undefined || current === null) return

    if (index >= parts.length) {
      targets.push({
        path: concretePath,
        value: current,
      })
      return
    }

    const part = parts[index]

    if (part.endsWith("[]")) {
      const key = part.slice(0, -2)
      const arrayValue = key ? current[key] : current

      if (!Array.isArray(arrayValue)) return

      arrayValue.forEach((item, itemIndex) => {
        const nextPath = key
          ? `${concretePath}${concretePath ? "." : ""}${key}[${itemIndex}]`
          : `${concretePath}[${itemIndex}]`

        visit(item, index + 1, nextPath)
      })

      return
    }

    visit(
      current[part],
      index + 1,
      `${concretePath}${concretePath ? "." : ""}${part}`
    )
  }

  visit(root, 0, "")

  return targets
}

function buildPatches(doc) {
  const paths = portableTextPaths[doc._type] || []
  const patches = []

  for (const declaredPath of paths) {
    const targets = resolvePathTargets(doc, declaredPath)

    for (const target of targets) {
      const value = target.value

      if (!Array.isArray(value)) continue
      if (!value.length) continue
      if (isLocaleBlock(value)) continue

      patches.push({
        declaredPath,
        path: target.path,
        value: toLocaleBlock(value),
        preview: `${value.length} block(s)`,
      })
    }
  }

  return patches
}

async function main() {
  console.log(`Mode: ${mode}`)
  console.log("Dataset: production")
  console.log("Migration PortableText vers localeBlock.")
  console.log("Recherche des documents ciblés...")

  const docs = await client.fetch(
    `*[_type in $types]{
      _id,
      _type,
      ...
    }`,
    {types: TARGET_TYPES}
  )

  console.log(`Documents trouvés: ${docs.length}`)

  let totalPatches = 0
  let modifiedDocs = 0
  const statsByType = {}

  for (const doc of docs) {
    const patches = buildPatches(doc)

    if (!patches.length) continue

    modifiedDocs += 1
    totalPatches += patches.length
    statsByType[doc._type] = (statsByType[doc._type] || 0) + patches.length

    console.log("")
    console.log(`Document: ${doc._type} / ${doc._id}`)

    patches.forEach((patch) => {
      console.log(`  - ${patch.path}: ${patch.preview}`)
    })

    if (mode === "apply") {
      const setPatch = {}

      patches.forEach((patch) => {
        setPatch[patch.path] = patch.value
      })

      await client.patch(doc._id).set(setPatch).commit()
      console.log(`  ✅ Migré: ${patches.length} champ(s)`)
    }
  }

  console.log("")
  console.log("──────────────────────────────")
  console.log("PortableText migration summary")
  console.log("──────────────────────────────")
  console.log(`Documents analysés : ${docs.length}`)
  console.log(`Documents modifiés : ${modifiedDocs}`)
  console.log(`Champs convertis   : ${totalPatches}`)

  console.log("")
  console.log("Par type :")
  for (const type of TARGET_TYPES) {
    console.log(`  ${type}: ${statsByType[type] || 0}`)
  }

  if (mode !== "apply") {
    console.log("")
    console.log("Dry-run uniquement. Rien n’a été modifié.")
    console.log("Pour appliquer : node tools\\migratePortableText.js --apply")
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})