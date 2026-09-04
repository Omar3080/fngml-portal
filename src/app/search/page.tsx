import { getVideos } from "@/lib/data";
import VideoCard from "@/components/VideoCard";
import Link from "next/link";
import { Search, Film } from "lucide-react";
import type { Metadata } from "next";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `نتائج البحث عن "${q}"` : "البحث في الفيديوهات",
    description: "ابحث في آلاف المقاطع والفيديوهات الحصرية.",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "" } = await searchParams;
  const cleanQ = q.trim().toLowerCase();

  const allVideos = getVideos();
  const results = cleanQ
    ? allVideos.filter(
        (v) =>
          v.title.toLowerCase().includes(cleanQ) ||
          v.category.toLowerCase().includes(cleanQ) ||
          (v.tags && v.tags.some((t) => t.toLowerCase().includes(cleanQ)))
      )
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="pb-4 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600/10 border border-rose-600/20 flex items-center justify-center text-rose-500">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              نتائج البحث عن: &ldquo;{q}&rdquo;
            </h1>
            <p className="text-xs text-zinc-400">
              تم العثور على {results.length} نتيجة بحث
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="text-xs text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg transition-colors self-start sm:self-auto"
        >
          ← العودة للرئيسية
        </Link>
      </div>

      {/* Grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {results.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-zinc-900/40 rounded-2xl border border-zinc-800 p-8">
          <Film className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
          <h3 className="text-zinc-200 font-bold text-sm mb-1">
            لم يتم العثور على أي نتائج
          </h3>
          <p className="text-zinc-500 text-xs mb-6 max-w-sm mx-auto">
            تأكد من كتابة الكلمات بشكل صحيح أو جرب البحث عن أسماء فنانات أو أقسام أخرى.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-full transition-colors"
          >
            استعراض جميع الفيديوهات
          </Link>
        </div>
      )}
    </div>
  );
}
