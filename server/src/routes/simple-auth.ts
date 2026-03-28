import { Router, type Request, type Response } from "express";
import type { Db } from "@paperclipai/db";
import { simpleSessions } from "../middleware/auth.js";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

// Clean up old sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [sessionId, data] of simpleSessions.entries()) {
    if (now - data.createdAt > 24 * 60 * 60 * 1000) {
      simpleSessions.delete(sessionId);
    }
  }
}, 60 * 60 * 1000); // Every hour

export function simpleAuthRoutes(db: Db) {
  const router = Router();

  // POST /api/simple-auth/login - Login with admin password only
  router.post("/login", async (req: Request, res: Response) => {
    if (!ADMIN_PASSWORD) {
      res.status(403).json({ error: "Simple auth not configured" });
      return;
    }

    const { password } = req.body;
    if (!password || typeof password !== "string") {
      res.status(400).json({ error: "Password required" });
      return;
    }

    if (password !== ADMIN_PASSWORD) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }

    // Create a simple session
    const sessionId = `simple:${Date.now()}:${Math.random().toString(36).substring(2)}`;
    simpleSessions.set(sessionId, { createdAt: Date.now() });

    res.json({
      success: true,
      session: {
        id: sessionId,
        userId: "admin",
      },
      user: {
        id: "admin",
        email: "admin@paperclip.local",
        name: "Administrator",
      },
    });
  });

  // POST /api/simple-auth/logout
  router.post("/logout", (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      const sessionId = authHeader.slice(7);
      simpleSessions.delete(sessionId);
    }
    res.json({ success: true });
  });

  // GET /api/simple-auth/session - Get current session
  router.get("/session", (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith("Bearer ")) {
      res.status(401).json({ error: "No session" });
      return;
    }

    const sessionId = authHeader.slice(7);
    const session = simpleSessions.get(sessionId);
    
    if (!session || !sessionId.startsWith("simple:")) {
      res.status(401).json({ error: "Invalid session" });
      return;
    }

    // Check if session is expired
    if (Date.now() - session.createdAt > 24 * 60 * 60 * 1000) {
      simpleSessions.delete(sessionId);
      res.status(401).json({ error: "Session expired" });
      return;
    }

    res.json({
      session: {
        id: sessionId,
        userId: "admin",
      },
      user: {
        id: "admin",
        email: "admin@paperclip.local",
        name: "Administrator",
      },
    });
  });

  return router;
}
