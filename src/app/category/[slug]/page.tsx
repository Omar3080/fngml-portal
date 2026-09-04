import { getVideos, getCategories } from "@/lib/data";
import CategoryNav from "@/components/CategoryNav";
import VideoCard from "@/components/VideoCard";
import Link from "next/link";
import { Folder, Flame } from "lucide-react";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const categories = getCategories();
  const category = categories.find((c) => c.slug === decodedSlug || c.name === decodedSlug);

  const title = category ? category.name : decodedSlug;
  return {
    title: `قسم ${title} - الفن والجمال`,
    description: `استعرض جميع مقاطع وفيديوهات قسم ${title} الحصرية بأعلى جودة.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const categories = getCategories();
  const allVideos = getVideos();

  // Find category match
  const matchedCategory = categories.find(
    (c) => c.slug === decodedSlug || c.name === decodedSlug
  );

  const categoryName = matchedCategory ? matchedCategory.name : decodedSlug;

  // Filter videos
  const videos =
    categoryName === "الكل" || decodedSlug === "all"
      ? allVideos
      : allVideos.filter((v) => v.category === categoryName);

  // Categories with counts
  const categoriesWithCounts = categories.map((cat) => ({
    ...cat,
    count:
      cat.name === "الكل" || cat.slug === "all"
        ? allVideos.length
        : allVideos.filter((v) => v.category === cat.name).length,
  }));

  return (
    <div className="min-h-screen">
      <CategoryNav
        categories={categoriesWithCounts}
        activeCategory={categoryName}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600/10 border border-rose-600/20 flex items-center justify-center text-rose-500">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-white">
                قسم: {categoryName}
              </h1>
              <p className="text-xs text-zinc-400">
                استعراض {videos.length} مقطع متوفر في هذا القسم
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="text-xs text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg transition-colors"
          >
            ← العودة للرئيسية
          </Link>
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
            <Flame className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
            <p className="text-zinc-400 text-sm mb-4">
              لا توجد فيديوهات مضافة في قسم &ldquo;{categoryName}&rdquo; حتى الآن.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-full transition-colors"
            >
              إضافة فيديو لهذا القسم
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
