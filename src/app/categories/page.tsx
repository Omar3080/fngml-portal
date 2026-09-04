import { getCategories, getVideos } from "@/lib/data";
import Link from "next/link";
import { Folder, Film, ChevronLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "جميع الأقسام والتصنيفات",
  description: "استعرض كافة تصنيفات وأقسام الفيديوهات المتاحة على المنصة.",
};

export default function CategoriesPage() {
  const categories = getCategories();
  const allVideos = getVideos();

  const categoriesWithCounts = categories
    .filter((c) => c.slug !== "all" && c.name !== "الكل")
    .map((cat) => ({
      ...cat,
      count: allVideos.filter((v) => v.category === cat.name).length,
    }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="pb-4 border-b border-zinc-800">
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          أقسام وتصنيفات الموقع
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          اختر القسم المفضل لديك لمشاهدة جميع المقاطع التابعة له
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categoriesWithCounts.map((cat) => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="group p-5 bg-[#16161b] hover:bg-[#1f1f26] border border-[#25252e] hover:border-rose-500/50 rounded-2xl transition-all duration-300 shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-600/10 border border-rose-600/20 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
                <Folder className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-zinc-100 group-hover:text-rose-400 transition-colors text-sm">
                  {cat.name}
                </h3>
                <span className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                  <Film className="w-3 h-3" />
                  <span>{cat.count} مقطع</span>
                </span>
              </div>
            </div>

            <ChevronLeft className="w-5 h-5 text-zinc-600 group-hover:text-rose-400 group-hover:-translate-x-1 transition-all" />
          </Link>
        ))}
      </div>
    </div>
  );
}
