import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // User progress API routes
  app.get("/api/progress/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve user progress" });
    }
  });

  app.post("/api/progress", async (req, res) => {
    try {
      const { userId, moduleId, completed, quizScore } = req.body;
      const progress = await storage.updateUserProgress({
        userId,
        moduleId,
        completed,
        quizScore,
        lastUpdated: new Date().toISOString()
      });
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user progress" });
    }
  });

  // Authentication routes
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      res.json({ id: user.id, username: user.username });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/register", async (req, res) => {
    try {
      const { username, password } = req.body;
      const existingUser = await storage.getUserByUsername(username);
      
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const newUser = await storage.createUser({ username, password });
      res.status(201).json({ id: newUser.id, username: newUser.username });
    } catch (error) {
      res.status(500).json({ message: "Registration failed" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
