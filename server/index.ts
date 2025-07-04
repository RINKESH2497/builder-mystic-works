import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleBackgroundRemoval } from "./routes/background-removal";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "10mb" })); // Increase limit for image uploads
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    res.json({ message: "Hello from Express server v2!" });
  });

  app.get("/api/demo", handleDemo);
  app.post("/api/remove-background", handleBackgroundRemoval);

  return app;
}
