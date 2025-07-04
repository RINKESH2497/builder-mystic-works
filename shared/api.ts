/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Background removal API types
 */
export interface BackgroundRemovalRequest {
  imageData: string; // base64 encoded image
}

export interface BackgroundRemovalResponse {
  success: boolean;
  processedImageUrl?: string;
  error?: string;
}
