"use client";

import Link from "next/link";
import { Category } from "@/types";
import { Flame, Sparkles } from "lucide-react";

interface CategoryNavProps {
  categories: Category[];
  activeCategory?: string;
}

export default function CategoryNav({ categories, activeCategory = "الكل" }: CategoryNavProps) {
  return (
    <div className="relative border-b border-[#222228] bg-[#141418]/60 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar scroll-smooth">
          {categories.map((cat) => {
            const isActive =
              activeCategory === cat.name ||
              (activeCategory === "الكل" && (cat.slug === "all" || cat.name === "الكل")) ||
              activeCategory === cat.slug;

            const href = cat.slug === "all" || cat.name === "الكل" ? "/" : `/category/${cat.slug}`;

            return (
              <Link
                key={cat.id}
                href={href}
                className={`whitespace-nowrap flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all shrink-0 ${
                  isActive
                    ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                    : "bg-zinc-800/80 text-zinc-300 hover:bg-zinc-700 hover:text-white border border-zinc-700/50"
                }`}
              >
                {cat.name === "الكل" ? (
                  <Sparkles className="w-3.5 h-3.5" />
                ) : cat.name.includes("حصرية") || cat.name.includes("لايف") ? (
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                ) : null}
                <span>{cat.name}</span>
                {cat.count !== undefined && cat.count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? "bg-rose-800/80 text-white" : "bg-zinc-900 text-zinc-400"
                    }`}
                  >
                    {cat.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
