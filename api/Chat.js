export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: req.body.messages.map(m => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }]
          })),
          systemInstruction: {
            parts: [{ text: "You are Zero AI, a professional search assistant. Be concise and helpful." }]
          }
        })
      }
    );

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, no response.";
    res.status(200).json({ text });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong." });
  }
}
