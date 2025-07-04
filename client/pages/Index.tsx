import { useState, useRef, useCallback } from "react";
import {
  Upload,
  Download,
  Sparkles,
  Image as ImageIcon,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import {
  BackgroundRemovalRequest,
  BackgroundRemovalResponse,
} from "@shared/api";

interface ProcessedImage {
  original: string;
  processed: string;
  filename: string;
}

export default function Index() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [originalFilename, setOriginalFilename] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG, JPG, etc.)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      // 10MB limit
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setUploadedImage(e.target.result as string);
        setOriginalFilename(file.name);
        setProcessedImage(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeBackground = async () => {
    if (!uploadedImage) return;

    setIsProcessing(true);
    try {
      const request: BackgroundRemovalRequest = {
        imageData: uploadedImage.split(",")[1], // Remove data:image/...;base64, prefix
      };

      const response = await fetch("/api/remove-background", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data: BackgroundRemovalResponse = await response.json();

      if (data.success && data.processedImageUrl) {
        setProcessedImage({
          original: uploadedImage,
          processed: data.processedImageUrl,
          filename: originalFilename,
        });
        toast({
          title: "Background removed!",
          description: "Your image has been processed successfully.",
        });
      } else {
        throw new Error(data.error || "Failed to process image");
      }
    } catch (error) {
      console.error("Error removing background:", error);
      toast({
        title: "Processing failed",
        description:
          "There was an error processing your image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!processedImage) return;

    const link = document.createElement("a");
    link.href = processedImage.processed;
    link.download = `no-bg-${processedImage.filename}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const reset = () => {
    setUploadedImage(null);
    setProcessedImage(null);
    setOriginalFilename("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gradient-from via-purple-500 to-gradient-to animate-gradient-shift bg-[length:400%_400%]">
      <div className="min-h-screen bg-black/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12 animate-slide-up">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/10 backdrop-blur-md mb-6">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              Background
              <span className="bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                {" "}
                Remover
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Remove backgrounds from your images instantly with AI-powered
              precision. Upload, process, and download in seconds.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {!uploadedImage && !processedImage && (
              /* Upload Area */
              <Card className="border-0 bg-white/10 backdrop-blur-md shadow-2xl animate-slide-up">
                <CardContent className="p-8">
                  <div
                    className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                      dragActive
                        ? "border-white bg-white/5 scale-105"
                        : "border-white/30 hover:border-white/50 hover:bg-white/5"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center space-y-6">
                      <div className="p-4 rounded-full bg-white/10 backdrop-blur-md">
                        <Upload className="h-12 w-12 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-semibold text-white mb-2">
                          Drop your image here
                        </p>
                        <p className="text-white/70 mb-6">
                          or click to browse • PNG, JPG up to 10MB
                        </p>
                        <Button
                          onClick={handleFileSelect}
                          size="lg"
                          className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-md transition-all duration-300 hover:scale-105"
                          variant="outline"
                        >
                          <ImageIcon className="mr-2 h-5 w-5" />
                          Choose Image
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {uploadedImage && !processedImage && (
              /* Processing Area */
              <div className="space-y-6 animate-slide-up">
                <Card className="border-0 bg-white/10 backdrop-blur-md shadow-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-white">
                        Original Image
                      </h2>
                      <Button
                        onClick={reset}
                        size="sm"
                        variant="ghost"
                        className="text-white/70 hover:text-white hover:bg-white/10"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Clear
                      </Button>
                    </div>
                    <div className="rounded-xl overflow-hidden bg-white/5 p-4">
                      <img
                        src={uploadedImage}
                        alt="Original"
                        className="w-full max-h-96 object-contain rounded-lg"
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="text-center">
                  <Button
                    onClick={removeBackground}
                    disabled={isProcessing}
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-white/90 font-semibold px-8 py-6 text-lg transition-all duration-300 hover:scale-105 disabled:scale-100"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-3 h-5 w-5" />
                        Remove Background
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {processedImage && (
              /* Results Area */
              <div className="space-y-6 animate-slide-up">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-0 bg-white/10 backdrop-blur-md shadow-2xl">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Original
                      </h3>
                      <div className="rounded-xl overflow-hidden bg-white/5 p-4">
                        <img
                          src={processedImage.original}
                          alt="Original"
                          className="w-full max-h-80 object-contain rounded-lg"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 bg-white/10 backdrop-blur-md shadow-2xl">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        Background Removed
                      </h3>
                      <div className="rounded-xl overflow-hidden bg-white/5 p-4 relative">
                        <div
                          className={
                            'absolute inset-4 bg-[url(\'data:image/svg+xml,%3csvg width="20" height="20" xmlns="http://www.w3.org/2000/svg"%3e%3cdefs%3e%3cpattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"%3e%3crect x="0" y="0" width="10" height="10" fill="%23f1f5f9"/%3e%3crect x="10" y="10" width="10" height="10" fill="%23f1f5f9"/%3e%3c/pattern%3e%3c/defs%3e%3crect width="100%25" height="100%25" fill="url(%23pattern)"/%3e%3c/svg%3e\')] rounded-lg'
                          }
                        ></div>
                        <img
                          src={processedImage.processed}
                          alt="Background removed"
                          className="w-full max-h-80 object-contain rounded-lg relative z-10"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={downloadImage}
                    size="lg"
                    className="bg-success hover:bg-success/90 text-success-foreground font-semibold px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
                  >
                    <Download className="mr-3 h-5 w-5" />
                    Download Image
                  </Button>
                  <Button
                    onClick={reset}
                    size="lg"
                    variant="outline"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-md font-semibold px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
                  >
                    Process Another
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-16 text-white/60">
            <p className="text-sm">
              Powered by AI • Secure processing • No data stored
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
