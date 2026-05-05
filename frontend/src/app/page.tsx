"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatedShaderHero } from "@/components/ui/animated-shader-hero";
import { MovieRow } from "@/components/movie/MovieRow";
import { detectEmotion, getRecommendations } from "@/lib/api";
import { RefreshCw, Filter, Video, VideoOff } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  const [emotion, setEmotion] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number>(0);
  const [movies, setMovies] = useState<any[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [genreFilter, setGenreFilter] = useState<string>("all");

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setHasCamera(true);
      setCameraActive(true);
    } catch (err) {
      console.error("Camera error:", err);
      alert("Please allow camera access to use emotion detection.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    setCameraActive(false);
  };

  useEffect(() => {
    if (cameraActive && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().catch(e => console.error("Video play error:", e));
      };
    }
  }, [cameraActive, stream]);

  const captureAndDetect = async () => {
    if (!videoRef.current || !cameraActive) return;
    
    setIsDetecting(true);
    try {
      const canvas = document.createElement("canvas");
      // Use 640x480 for better face detection/classification accuracy
      canvas.width = 640;
      canvas.height = 480;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      ctx.drawImage(videoRef.current, 0, 0, 640, 480);
      const base64Img = canvas.toDataURL("image/jpeg", 0.6);
      
      const result = await detectEmotion(base64Img);
      if (result && result.emotion) {
        setEmotion(result.emotion);
        setConfidence(result.confidence || 0);
        fetchRecommendations(result.emotion);
        stopCamera(); // Stop after detecting a clear emotion
      } else {
        alert("Detection failed. Server returned: " + JSON.stringify(result));
      }
    } catch (e: any) {
      console.error(e);
      alert("Error detecting emotion: " + (e.message || String(e)));
    } finally {
      setIsDetecting(false);
    }
  };

  const fetchRecommendations = async (detectedEmotion: string) => {
    setIsLoading(true);
    const recs = await getRecommendations(detectedEmotion);
    setMovies(recs);
    setIsLoading(false);
    
    // Scroll to recommendations
    setTimeout(() => {
      document.getElementById("recommendations")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // No automatic interval, user will capture manually

  // Derived sections
  const filteredMovies = genreFilter === "all" ? movies : movies.filter(m => m.genre?.toLowerCase() === genreFilter.toLowerCase());
  
  // Fake splitting into rows for "Netflix" style
  const topPicks = filteredMovies.slice(0, 10);
  const secondaryRow = filteredMovies.slice(10, 20);

  const getEmotionEmoji = (e: string) => {
    const map: Record<string, string> = {
      happy: "😊", sad: "😢", angry: "😠", fear: "😨", surprise: "😲", disgust: "🤢", neutral: "😐"
    };
    return map[e.toLowerCase()] || "😐";
  };

  return (
    <main className="min-h-screen bg-background pb-20">
      {!emotion ? (
        <div className="animate-in fade-in duration-500">
          <AnimatedShaderHero 
            onStart={() => {
              startCamera();
              document.getElementById("camera-section")?.scrollIntoView({ behavior: "smooth" });
            }}
            onExplore={() => {
              setEmotion("happy");
              fetchRecommendations("happy");
            }}
          />

          <div id="camera-section" className="container mx-auto px-4 mt-12 mb-20 flex flex-col items-center">
            {cameraActive ? (
              <div className="relative w-full max-w-2xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black min-h-[300px]">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted
                  className="w-full h-auto object-cover transform scale-x-[-1]"
                />
                <div className="absolute top-4 right-4 bg-black/60 px-3 py-1 rounded-full flex items-center gap-2 text-sm font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Camera Active
                </div>
                
                {/* Manual Capture Button */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                  <button 
                    onClick={captureAndDetect}
                    disabled={isDetecting}
                    className="px-8 py-3 bg-white text-black rounded-full font-bold shadow-xl hover:scale-105 transition active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
                  >
                    {isDetecting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        Detecting...
                      </>
                    ) : (
                      <>
                        📸 Capture Emotion
                      </>
                    )}
                  </button>
                </div>

                <button 
                  onClick={stopCamera}
                  className="absolute bottom-6 right-6 bg-black/50 backdrop-blur-md p-3 rounded-full hover:bg-black/80 transition"
                >
                  <VideoOff className="w-5 h-5 text-white" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center p-12 bg-secondary/50 rounded-2xl border border-white/5 w-full max-w-2xl">
                <Video className="w-16 h-16 text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  Enable your camera to let our AI analyze your facial expressions and find the perfect movie for your current mood.
                </p>
                <button 
                  onClick={startCamera}
                  className="px-6 py-3 bg-primary text-white rounded-full font-medium hover:bg-primary/90 transition flex items-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  Enable Camera
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div id="recommendations" className="pt-24 animate-in slide-in-from-bottom-10 fade-in duration-700">
        {emotion && (
          <div className="container mx-auto px-4 mb-12">
            <div className="bg-gradient-to-r from-primary/20 to-transparent p-8 rounded-2xl border border-primary/20 flex flex-col md:flex-row items-center justify-between">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 flex items-center gap-4">
                  {getEmotionEmoji(emotion)} You're feeling {emotion.toUpperCase()}
                </h2>
                <p className="text-gray-300 text-lg">
                  {confidence > 0 && `Confidence: ${(confidence * 100).toFixed(0)}% • `} 
                  Because you're in this mood, we picked these for you:
                </p>
              </div>
              <div className="mt-6 md:mt-0 flex items-center gap-4">
                <Select value={genreFilter} onValueChange={setGenreFilter}>
                  <SelectTrigger className="w-[150px] bg-black/50 border-white/20">
                    <SelectValue placeholder="Genre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genres</SelectItem>
                    <SelectItem value="action">Action</SelectItem>
                    <SelectItem value="comedy">Comedy</SelectItem>
                    <SelectItem value="drama">Drama</SelectItem>
                  </SelectContent>
                </Select>
                <button 
                  onClick={() => {
                    setEmotion(null);
                    setMovies([]);
                  }}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full transition font-medium"
                >
                  Restart
                </button>
                <button 
                  onClick={() => fetchRecommendations(emotion)}
                  className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition"
                  title="Refresh Recommendations"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="px-8 flex gap-4 overflow-hidden">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="w-[240px] h-[360px] rounded-xl shrink-0 bg-white/5" />
            ))}
          </div>
        ) : movies.length > 0 ? (
          <>
            <MovieRow title="🔥 Top Picks for You" movies={topPicks} />
            {secondaryRow.length > 0 && (
              <MovieRow title="✨ More Like This" movies={secondaryRow} />
            )}
          </>
        ) : null}
        </div>
      )}
    </main>
  );
}
