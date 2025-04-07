import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for user progress
  app.get("/api/progress/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  app.post("/api/progress", async (req, res) => {
    try {
      const progressData = req.body;
      const progress = await storage.updateUserProgress(progressData);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // API routes for quiz attempts
  app.post("/api/quiz/attempt", async (req, res) => {
    try {
      const quizData = req.body;
      const attempt = await storage.saveQuizAttempt(quizData);
      res.json(attempt);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  app.get("/api/quiz/attempts/:userId/:tutorialId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const tutorialId = req.params.tutorialId;
      const attempts = await storage.getQuizAttempts(userId, tutorialId);
      res.json(attempts);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  // User authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = req.body;
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      res.json({ id: user.id, username: user.username });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
