require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function regexExtract(text) {
  return {
    name: text.match(/my name is\s+([a-zA-Z\s]+)/i)?.[1]?.trim() || "",
    email: text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,}/)?.[0] || "",
    phone: text.match(/\b\d{10}\b/)?.[0] || "",
    event: text.match(/\b(freshers|workshop|seminar|conference|meeting|event)\b/i)?.[0] || "",
    organization: text.match(/college of [a-zA-Z\s]+/i)?.[0] || "",
    place: text.match(/\b(Hyderabad|Bangalore|Chennai|Delhi|Mumbai)\b/i)?.[0] || "",
    date: text.match(/\b\d{1,2}\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s\d{4}\b/i)?.[0] || ""
  };
}

app.post("/api/parse", async (req, res) => {
  const text = req.body.text || "";
  const base = regexExtract(text);

  // If everything filled, skip AI
  if (Object.values(base).every(v => v)) {
    return res.json(base);
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
Fill ONLY missing fields. Do NOT invent data.
Return valid JSON with keys: name,email,phone,event,organization,place,date.
Text: "${text}"
Existing: ${JSON.stringify(base)}
`;
    const out = await model.generateContent(prompt);
    const ai = JSON.parse(out.response.text());

    // Merge: regex wins, AI only fills blanks
    const merged = {};
    for (const k of Object.keys(base)) {
      merged[k] = base[k] || ai[k] || "";
    }
    res.json(merged);
  } catch {
    res.json(base); // fallback
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
console.log("Auto Fill clicked");


