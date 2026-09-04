import { getVideos, getCategories } from "@/lib/data";
import CategoryNav from "@/components/CategoryNav";
import VideoCard from "@/components/VideoCard";
import Link from "next/link";
import { Flame, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams.page || "1", 10);
  const limit = 16;

  const allVideos = getVideos();
  const categories = getCategories();

  // Add counts to categories
  const categoriesWithCounts = categories.map((cat) => ({
    ...cat,
    count:
      cat.name === "الكل" || cat.slug === "all"
        ? allVideos.length
        : allVideos.filter((v) => v.category === cat.name).length,
  }));

  const total = allVideos.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (currentPage - 1) * limit;
  const videos = allVideos.slice(startIndex, startIndex + limit);

  return (
    <div className="min-h-screen">
      {/* Category Navigation Bar */}
      <CategoryNav categories={categoriesWithCounts} activeCategory="الكل" />

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-rose-600/10 border border-rose-600/20 flex items-center justify-center text-rose-500">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                أحدث الفيديوهات الحصرية
              </h1>
              <p className="text-xs text-zinc-400">
                تصفح أفضل وأحدث المقاطع المرفوعة بجودة عالية
              </p>
            </div>
          </div>

          <div className="text-xs text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full self-start sm:self-auto flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>إجمالي الفيديوهات: </span>
            <strong className="text-white font-bold">{total}</strong>
          </div>
        </div>

        {/* Video Grid */}
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-zinc-900/40 rounded-2xl border border-zinc-800 p-8">
            <p className="text-zinc-400 text-sm mb-4">لا توجد فيديوهات متاحة حالياً.</p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-full transition-colors"
            >
              إضافة فيديو جديد من لوحة التحكم
            </Link>
          </div>
        )}

        {/* Pagination bar (matching fngml.com pagination) */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-8 pb-4">
            {currentPage > 1 && (
              <Link
                href={`/?page=${currentPage - 1}`}
                className="flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
                <span>السابق</span>
              </Link>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/?page=${p}`}
                className={`w-9 h-9 flex items-center justify-center text-xs font-bold rounded-lg transition-all ${
                  currentPage === p
                    ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                    : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800"
                }`}
              >
                {p}
              </Link>
            ))}

            {currentPage < totalPages && (
              <Link
                href={`/?page=${currentPage + 1}`}
                className="flex items-center gap-1 px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
              >
                <span>التالي</span>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
