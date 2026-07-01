// tools/lib/ollama.js
const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434/api/chat";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2.5-coder:7b";

export async function askQwen({ system, user, temperature = 0.2 }) {
  // 🔹 On crée un contrôleur pour forcer Node.js à attendre (5 minutes max)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 300000);

  try {
    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal, // 🔹 On injecte le signal anti-timeout
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        options: { 
          temperature,
          num_ctx: 8192 // 🔹 Le sweet spot pour ta configuration
        },
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Ollama error ${response.status}: ${body}`);
    }

    const data = await response.json();
    const content = data?.message?.content?.trim();
    if (!content) throw new Error("Ollama returned an empty response.");
    return content;

  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error("Node.js a coupé : Ollama a mis plus de 5 minutes à répondre.");
    }
    throw error;
  }
}