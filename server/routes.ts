import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for utility tools can be added here if needed
  // Currently all tools work client-side only
  
  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", message: "ToolMaster API is running" });
  });

  const httpServer = createServer(app);
  return httpServer;
}
