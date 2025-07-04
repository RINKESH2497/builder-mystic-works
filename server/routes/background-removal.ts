import { RequestHandler } from "express";
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
    const apiKey = process.env.REMOVE_BG_API_KEY;

    if (!apiKey) {
      // For demo purposes, we'll create a better mock response using Sharp
      console.log("No API key provided, creating mock response with Sharp");

      try {
        const sharp = await import("sharp");
        // Convert base64 to buffer
        const imageBuffer = Buffer.from(imageData, "base64");

        // Process with Sharp to create a mock background removal effect
        // This creates a basic mask effect - in production use real AI service
        const processedBuffer = await sharp
          .default(imageBuffer)
          .png()
          .modulate({
            brightness: 1.1,
            saturation: 1.2,
          })
          .toBuffer();

        const processedBase64 = processedBuffer.toString("base64");
        const mockProcessedImage = `data:image/png;base64,${processedBase64}`;

        const response: BackgroundRemovalResponse = {
          success: true,
          processedImageUrl: mockProcessedImage,
        };

        // Add some delay to simulate processing
        await new Promise((resolve) => setTimeout(resolve, 2500));

        return res.json(response);
      } catch (sharpError) {
        console.error("Sharp processing error:", sharpError);
        // Fallback to simple response
        const mockProcessedImage = `data:image/png;base64,${imageData}`;
        const response: BackgroundRemovalResponse = {
          success: true,
          processedImageUrl: mockProcessedImage,
        };

        await new Promise((resolve) => setTimeout(resolve, 2000));
        return res.json(response);
      }
    }

    // Real API call when API key is available
    const { removeBackgroundFromImageBase64 } = await import("remove.bg");
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
