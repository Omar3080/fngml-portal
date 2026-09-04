"use client";

import { useEffect, useRef, useState } from "react";
import { Play, AlertCircle } from "lucide-react";

interface VideoPlayerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  videoId: string;
  title: string;
}

export default function VideoPlayer({ videoUrl, thumbnailUrl, videoId, title }: VideoPlayerProps) {
  const [hasTrackedView, setHasTrackedView] = useState(false);
  const [playerError, setPlayerError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Trigger view increment
  const handlePlay = () => {
    if (!hasTrackedView) {
      setHasTrackedView(true);
      fetch(`/api/videos/${videoId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "increment_views" }),
      }).catch((err) => console.error("Error updating views:", err));
    }
  };

  const isEmbed =
    videoUrl.includes("<iframe") ||
    videoUrl.includes("youtube.com") ||
    videoUrl.includes("youtu.be") ||
    videoUrl.includes("dailymotion.com") ||
    videoUrl.includes("vimeo.com") ||
    videoUrl.includes("streamtape.com") ||
    videoUrl.includes("doodstream") ||
    videoUrl.includes("ok.ru");

  // Extract src if user pasted a raw iframe tag
  const getEmbedSrc = (url: string) => {
    if (url.includes("<iframe")) {
      const match = url.match(/src=["']([^"']+)["']/);
      return match ? match[1] : "";
    }
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    if (url.includes("youtu.be/")) {
      const id = url.split("youtu.be/")[1]?.split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  return (
    <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 flex items-center justify-center group">
      {isEmbed ? (
        <iframe
          src={getEmbedSrc(videoUrl)}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="w-full h-full border-0"
          onLoad={handlePlay}
        />
      ) : (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={thumbnailUrl}
          controls
          playsInline
          onPlay={handlePlay}
          onError={() => setPlayerError(true)}
          className="w-full h-full object-contain bg-black"
        >
          <source src={videoUrl} type="video/mp4" />
          متصفحك لا يدعم تشغيل هذا الفيديو.
        </video>
      )}

      {playerError && (
        <div className="absolute inset-0 bg-zinc-950/90 flex flex-col items-center justify-center p-6 text-center text-zinc-300">
          <AlertCircle className="w-12 h-12 text-rose-500 mb-2" />
          <p className="text-sm font-semibold mb-3">تعذر تشغيل هذا الرابط مباشرة في المتصفح</p>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-all"
          >
            فتح الرابط في صفحة خارجية
          </a>
        </div>
      )}
    </div>
  );
}
