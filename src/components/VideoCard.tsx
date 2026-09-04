"use client";

import { useState } from "react";
import Link from "next/link";
import { Video } from "@/types";
import { Play, Eye, Clock, Film } from "lucide-react";

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const [imgError, setImgError] = useState(false);

  // Format views
  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return (views / 1000000).toFixed(1) + "M";
    }
    if (views >= 1000) {
      return (views / 1000).toFixed(1) + "K";
    }
    return views.toString();
  };

  // Format relative date
  const formatTimeAgo = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHrs / 24);

      if (diffDays > 0) {
        return `منذ ${diffDays} ${diffDays === 1 ? "يوم" : diffDays === 2 ? "يومين" : "أيام"}`;
      }
      if (diffHrs > 0) {
        return `منذ ${diffHrs} ${diffHrs === 1 ? "ساعة" : diffHrs === 2 ? "ساعتين" : "ساعات"}`;
      }
      return "حديثاً";
    } catch {
      return "حديثاً";
    }
  };

  return (
    <div className="group flex flex-col bg-[#18181c] hover:bg-[#202026] rounded-xl overflow-hidden border border-[#27272e] hover:border-rose-500/40 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-rose-950/10">
      
      {/* Thumbnail Container */}
      <Link href={`/watch/${video.id}`} className="relative aspect-video w-full overflow-hidden bg-zinc-900 block">
        {imgError ? (
          <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 bg-zinc-900">
            <Film className="w-12 h-12 mb-1" />
            <span className="text-xs">معاينة الفيديو</span>
          </div>
        ) : (
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        )}

        {/* Hover Overlay with glowing Play Button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
          <div className="w-12 h-12 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-lg shadow-rose-600/50 transform group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </div>
        </div>

        {/* Duration Badge */}
        {video.duration && (
          <span className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-sm text-white text-[11px] font-semibold px-2 py-0.5 rounded shadow">
            {video.duration}
          </span>
        )}

        {/* Quality Badge */}
        <span className="absolute top-2 right-2 bg-rose-600/90 backdrop-blur-sm text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow">
          HD
        </span>
      </Link>

      {/* Video Details */}
      <div className="p-3 flex flex-col flex-1 justify-between gap-2">
        <Link
          href={`/watch/${video.id}`}
          className="text-sm font-semibold text-zinc-100 hover:text-rose-400 transition-colors line-clamp-2 leading-snug"
          title={video.title}
        >
          {video.title}
        </Link>

        <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-auto pt-2 border-t border-zinc-800/60">
          <span className="text-rose-400 font-medium hover:underline">
            {video.category}
          </span>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-zinc-500" />
              <span>{formatViews(video.views)}</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-zinc-500" />
              <span>{formatTimeAgo(video.createdAt)}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
