import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- API Routes ---

  // 1. Live Intelligence Signal Extraction (AI Endpoint)
  app.post("/api/ai/analyze-request", async (req, res) => {
    // This will use Gemini to generate the aiSummary and aiTags in Phase 2
    res.json({ message: "AI Analysis Engine initialized. Ready for Phase 2." });
  });

  // 2. Trust Score Algorithm (Background logic)
  app.post("/api/reputation/calculate", (req, res) => {
    res.json({ status: "ok" });
  });

  // 3. Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "operational", timestamp: new Date().toISOString() });
  });

  // --- Vite Integration ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving logic
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n\x1b[32m[HelpHub AI Backend]\x1b[0m Server running at http://localhost:${PORT}`);
    console.log(`\x1b[36m[Mode]\x1b[0m ${process.env.NODE_ENV || 'development'}\n`);
  });
}

startServer();
