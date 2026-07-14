import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Instantiate GoogleGenAI client on the server side
  let ai: GoogleGenAI | null = null;
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
    try {
      ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
      console.log("GoogleGenAI initialized successfully on the server.");
    } catch (e) {
      console.error("Failed to initialize GoogleGenAI:", e);
    }
  } else {
    console.warn("GEMINI_API_KEY is not set or using placeholder. Chatbot will run in fallback simulation mode.");
  }

  // --- API ROUTES FIRST ---

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", aiAvailable: !!ai });
  });

  // 1. Supportive Chatbot Endpoint
  app.post("/api/chat", async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // fallback responses in case API key is missing or calls fail
    const fallbackResponse = (msg: string) => {
      const lower = msg.toLowerCase();
      if (lower.includes("guilt") || lower.includes("mother") || lower.includes("baby")) {
        return "I hear how much pressure you're under. Transitioning into motherhood is one of the most challenging experiences any person can go through. Please remember that needing space doesn't make you a bad mother—it makes you human. Taking care of your nervous system is a beautiful way of taking care of your baby. What small 5-minute pause can you gift yourself today?";
      }
      if (lower.includes("panic") || lower.includes("anxious") || lower.includes("anxiety")) {
        return "Anxiety and panic waves can feel intensely frightening, but they are waves of energy that will pass. You are safe in this present moment. Let's try a simple grounding breath together: breathe in for 4 seconds, hold for 7 seconds, and release slowly for 8 seconds. Would you like me to guide you through a gentle body scan right now?";
      }
      if (lower.includes("sleep") || lower.includes("insomnia") || lower.includes("night")) {
        return "Rest is so essential, but forcing sleep often creates more tension. Let's release the pressure to sleep. Right now, simply focus on the physical weight of your body sinking into your mattress. Let go of your shoulders, release your jaw. I am here with you to hold a quiet space.";
      }
      return "Thank you for sharing that with me. I am here as your Ashwash digital wellness companion. It is completely safe to express whatever is on your mind. How does your body feel right now as you write these words? Let's take a slow, deep breath together.";
    };

    if (!ai) {
      // Simulate slow typing and send fallback
      await new Promise((resolve) => setTimeout(resolve, 800));
      return res.json({ response: fallbackResponse(message) });
    }

    try {
      const systemInstruction = `You are a highly compassionate, empathetic, and professional psychological wellness assistant for "Ashwash" (আশ্বাস). 
Ashwash represents "solace" and "reassurance" in Bangla. Your tone should be gentle, eye-safe, and deeply grounded in trauma-informed, evidence-based mental health support (similar to high-end premium wellness retreat coaching).
Avoid any robotic, diagnostic, or clinical jargon. Respond to the user's emotional distress with warm, human connection.
Always structure your answers with scannable layout, using bullet points or short paragraphs to minimize cognitive load.
Include a grounding micro-suggestion or question at the end to guide the user toward peace.
Do not diagnose, prescribe, or provide clinical treatments. If the user indicates emergency self-harm, gently advise calling 988 or using the Crisis Line.`;

      const contents = history ? [...history, { role: "user", parts: [{ text: message }] }] : message;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || fallbackResponse(message);
      res.json({ response: replyText });
    } catch (error: any) {
      console.error("Gemini API Chat Error:", error);
      res.json({ response: fallbackResponse(message), error: error.message });
    }
  });

  // 2. Dynamic Mental Health Assessment Evaluation
  app.post("/api/assessment", async (req, res) => {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: "Answers array is required" });
    }

    const totalScore = answers.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
    let category: "mild" | "moderate" | "severe" = "mild";
    if (totalScore >= 12 && totalScore < 20) category = "moderate";
    if (totalScore >= 20) category = "severe";

    const defaultRecommendations = [
      "Engage in our guided 'The Quiet Mind' course to build foundational anxiety reframing skills.",
      "Practice 'Oceanic Breathing' twice daily for at least 5 minutes to regulate autonomic stress responses.",
      "Check in daily with the Mood Tracker to identify latent stress triggers before they accumulate.",
      "Log your experiences anonymously in our peer community to feel connected and less isolated.",
      "Schedule a gentle 1-on-1 consultation session with one of our licensed psychologists to map a personalized care plan."
    ];

    if (!ai) {
      return res.json({
        score: totalScore,
        category,
        recommendations: defaultRecommendations
      });
    }

    try {
      const prompt = `Evaluate the psychological well-being assessment of a user on Ashwash.
The user has scored a total score of ${totalScore} out of 30 across questions evaluating stress, cognitive fatigue, emotional regulation, and sleep patterns.
The mathematical category of anxiety/distress calculated is "${category}".
Provide a professional, supportive analysis of this score and generate exactly 4 highly personalized, actionable self-care recommendations for the user.
Format your output strictly as a JSON object containing the following keys:
"scoreDescription": string (e.g. "Your score indicates mild levels of day-to-day stress...")
"analysis": string (a gentle, comforting, non-clinical summary)
"recommendations": string[] (exactly 4 custom-crafted actionable advice items)

Do not return any markdown code block indicators other than JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              scoreDescription: { type: Type.STRING },
              analysis: { type: Type.STRING },
              recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              }
            },
            required: ["scoreDescription", "analysis", "recommendations"]
          }
        }
      });

      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText.trim());
        return res.json({
          score: totalScore,
          category,
          scoreDescription: parsed.scoreDescription,
          analysis: parsed.analysis,
          recommendations: parsed.recommendations
        });
      }

      res.json({
        score: totalScore,
        category,
        recommendations: defaultRecommendations
      });
    } catch (error: any) {
      console.error("Gemini API Assessment Error:", error);
      res.json({
        score: totalScore,
        category,
        recommendations: defaultRecommendations,
        error: error.message
      });
    }
  });

  // --- VITE MIDDLEWARE SETUP ---

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

startServer();
