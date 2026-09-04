"use client";

import { useState } from "react";
import { Share2, ThumbsUp, Download, Check, Copy } from "lucide-react";

interface WatchActionsProps {
  videoUrl: string;
  title: string;
}

export default function WatchActions({ videoUrl, title }: WatchActionsProps) {
  const [likes, setLikes] = useState(128);
  const [hasLiked, setHasLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="flex items-center gap-2 relative flex-wrap">
      {/* Like button */}
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
          hasLiked
            ? "bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30"
            : "bg-zinc-900 text-zinc-300 border-zinc-800 hover:bg-zinc-800 hover:text-white"
        }`}
      >
        <ThumbsUp className={`w-4 h-4 ${hasLiked ? "fill-white" : ""}`} />
        <span>{likes}</span>
      </button>

      {/* Share button */}
      <button
        onClick={() => setShowShareModal(!showShareModal)}
        className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-all"
      >
        <Share2 className="w-4 h-4" />
        <span>مشاركة</span>
      </button>

      {/* Download button if direct link */}
      {videoUrl.startsWith("http") && !videoUrl.includes("<iframe") && (
        <a
          href={videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          download
          className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-all"
        >
          <Download className="w-4 h-4" />
          <span>تحميل الفيديو</span>
        </a>
      )}

      {/* Share Modal Popup */}
      {showShareModal && (
        <div className="absolute top-12 left-0 z-50 w-72 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <h4 className="text-xs font-bold text-white mb-2">مشاركة رابط الفيديو</h4>
          <p className="text-[11px] text-zinc-400 mb-3 truncate">{title}</p>
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-rose-600/20"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>تم نسخ الرابط!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>نسخ الرابط</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
