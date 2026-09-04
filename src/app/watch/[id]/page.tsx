import { notFound } from "next/navigation";
import { getVideoById, getVideos } from "@/lib/data";
import VideoPlayer from "@/components/VideoPlayer";
import VideoCard from "@/components/VideoCard";
import WatchActions from "@/components/WatchActions";
import Link from "next/link";
import { Eye, Clock, Folder, ChevronLeft, Film } from "lucide-react";
import type { Metadata } from "next";

interface WatchPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: WatchPageProps): Promise<Metadata> {
  const { id } = await params;
  const video = getVideoById(id);

  if (!video) {
    return {
      title: "الفيديو غير موجود",
    };
  }

  return {
    title: `${video.title} - مشاهدة الفيديو الحصري`,
    description: `مشاهدة فيديو ${video.title} بجودة عالية وبدون تقطيع على منصة الفن والجمال.`,
    openGraph: {
      title: video.title,
      images: [video.thumbnailUrl],
    },
  };
}

export default async function WatchPage({ params }: WatchPageProps) {
  const { id } = await params;
  const video = getVideoById(id);

  if (!video) {
    notFound();
  }

  const allVideos = getVideos();
  // Get related videos (same category or others, excluding current)
  const relatedVideos = allVideos
    .filter((v) => v.id !== video.id)
    .sort((a, b) => (a.category === video.category ? -1 : 1))
    .slice(0, 8);

  const formatViews = (views: number) => {
    if (views >= 1000000) return (views / 1000000).toFixed(1) + "M";
    if (views >= 1000) return (views / 1000).toFixed(1) + "K";
    return views.toString();
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("ar-EG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "تاريخ غير معروف";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-zinc-400 mb-6 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-rose-400 transition-colors">
          الرئيسية
        </Link>
        <ChevronLeft className="w-3.5 h-3.5 text-zinc-600" />
        <Link
          href={`/category/${encodeURIComponent(video.category)}`}
          className="hover:text-rose-400 transition-colors"
        >
          {video.category}
        </Link>
        <ChevronLeft className="w-3.5 h-3.5 text-zinc-600" />
        <span className="text-zinc-200 truncate max-w-xs">{video.title}</span>
      </nav>

      {/* Main Grid: Player Area (Left/Top) & Related Area (Right/Bottom) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left/Main Column: Video Player & Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Player Container */}
          <VideoPlayer
            videoUrl={video.videoUrl}
            thumbnailUrl={video.thumbnailUrl}
            videoId={video.id}
            title={video.title}
          />

          {/* Title & Actions Box */}
          <div className="bg-[#151519] border border-[#23232a] rounded-2xl p-5 space-y-4 shadow-sm">
            <h1 className="text-lg sm:text-2xl font-black text-white leading-snug">
              {video.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-zinc-800">
              
              {/* Meta Info */}
              <div className="flex items-center gap-4 text-xs text-zinc-400 flex-wrap">
                <span className="flex items-center gap-1.5 text-rose-400 font-bold bg-rose-950/40 border border-rose-900/50 px-2.5 py-1 rounded-full">
                  <Folder className="w-3.5 h-3.5" />
                  <span>{video.category}</span>
                </span>

                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{formatViews(video.views)} مشاهدة</span>
                </span>

                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{formatDate(video.createdAt)}</span>
                </span>
              </div>

              {/* Action Buttons */}
              <WatchActions videoUrl={video.videoUrl} title={video.title} />
            </div>

            {/* Description & Tags if present */}
            {(video.description || (video.tags && video.tags.length > 0)) && (
              <div className="pt-4 border-t border-zinc-800/80 text-xs text-zinc-300 space-y-3">
                {video.description && (
                  <p className="leading-relaxed text-zinc-300">{video.description}</p>
                )}

                {video.tags && video.tags.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-2">
                    <span className="text-zinc-500 text-[11px]">الوسوم:</span>
                    {video.tags.map((tag, idx) => (
                      <Link
                        key={idx}
                        href={`/search?q=${encodeURIComponent(tag)}`}
                        className="bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 text-[11px] px-2.5 py-1 rounded-md transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Related Videos */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-zinc-800">
            <Film className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-white">فيديوهات مقترحة ذات صلة</h3>
          </div>

          <div className="space-y-3">
            {relatedVideos.map((item) => (
              <VideoCard key={item.id} video={item} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
