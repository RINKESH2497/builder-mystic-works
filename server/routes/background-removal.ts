import { RequestHandler } from "express";
import { removeBackgroundFromImageBase64 } from "remove.bg";
import {
  BackgroundRemovalRequest,
  BackgroundRemovalResponse,
} from "@shared/api";

export const handleBackgroundRemoval: RequestHandler = async (req, res) => {
  try {
    const { imageData }: BackgroundRemovalRequest = req.body;

    if (!imageData) {
      const response: BackgroundRemovalResponse = {
        success: false,
        error: "No image data provided",
      };
      return res.status(400).json(response);
    }

    // Note: In production, you should get this from environment variables
    // For now, we'll simulate the API call since we don't have a real API key
    const apiKey = process.env.REMOVE_BG_API_KEY;

    if (!apiKey) {
      // For demo purposes, we'll create a mock response
      // In production, you need a real remove.bg API key
      console.log("No API key provided, creating mock response");

      // Create a simple mock by adding transparency to simulate background removal
      // This is just for demo - in production use the real API
      const mockProcessedImage = `data:image/png;base64,${imageData}`;

      const response: BackgroundRemovalResponse = {
        success: true,
        processedImageUrl: mockProcessedImage,
      };

      // Add some delay to simulate processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      return res.json(response);
    }

    // Real API call when API key is available
    const result = await removeBackgroundFromImageBase64({
      base64img: imageData,
      apiKey: apiKey,
      size: "regular",
      type: "auto",
    });

    const response: BackgroundRemovalResponse = {
      success: true,
      processedImageUrl: `data:image/png;base64,${result.base64img}`,
    };

    res.json(response);
  } catch (error) {
    console.error("Background removal error:", error);

    const response: BackgroundRemovalResponse = {
      success: false,
      error: "Failed to process image. Please try again.",
    };

    res.status(500).json(response);
  }
};
