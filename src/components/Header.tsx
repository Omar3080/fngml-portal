"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Flame, Menu, X, PlusCircle, Shield } from "lucide-react";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#121215]/95 backdrop-blur-md border-b border-[#222228]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-500 flex items-center justify-center shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-transform">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white group-hover:text-rose-400 transition-colors">
                  الفن والجمال
                </span>
                <span className="text-[10px] text-zinc-400 -mt-1 font-medium">
                  منصة الفيديوهات الحصرية
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-zinc-300">
              <Link
                href="/"
                className="px-3 py-2 rounded-lg hover:text-white hover:bg-zinc-800/60 transition-colors"
              >
                الرئيسية
              </Link>
              <Link
                href="/category/all"
                className="px-3 py-2 rounded-lg hover:text-white hover:bg-zinc-800/60 transition-colors"
              >
                جميع الفيديوهات
              </Link>
              <Link
                href="/categories"
                className="px-3 py-2 rounded-lg hover:text-white hover:bg-zinc-800/60 transition-colors"
              >
                الأقسام
              </Link>
            </nav>
          </div>

          {/* Search Bar - Center / Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-md mx-4 relative items-center"
          >
            <input
              type="text"
              placeholder="ابحث عن مقطع، فنانة، أو تصنيف..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/90 border border-zinc-800 text-sm text-zinc-200 placeholder-zinc-500 rounded-full py-2 pr-10 pl-4 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-3 text-zinc-400 hover:text-rose-400 transition-colors"
              aria-label="بحث"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-md shadow-rose-600/20 transition-all hover:scale-102 active:scale-98"
            >
              <PlusCircle className="w-4 h-4" />
              <span>إضافة فيديو</span>
            </Link>

            <Link
              href="/admin"
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800/60 rounded-xl transition-colors"
              title="لوحة الإدارة"
            >
              <Shield className="w-5 h-5" />
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
              aria-label="القائمة"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-zinc-800 space-y-4 animate-in fade-in duration-150">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="ابحث عن مقطع أو فنانة..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 text-sm text-zinc-200 placeholder-zinc-500 rounded-xl py-2.5 pr-10 pl-4 focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-3 text-zinc-400 hover:text-rose-400"
              >
                <Search className="w-5 h-5" />
              </button>
            </form>

            <nav className="flex flex-col space-y-2 text-sm font-medium text-zinc-300">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-zinc-800 hover:text-white"
              >
                الرئيسية
              </Link>
              <Link
                href="/category/all"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-zinc-800 hover:text-white"
              >
                جميع الفيديوهات
              </Link>
              <Link
                href="/categories"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 rounded-lg hover:bg-zinc-800 hover:text-white"
              >
                الأقسام
              </Link>
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-rose-400 font-semibold rounded-lg hover:bg-zinc-800"
              >
                <PlusCircle className="w-4 h-4" />
                <span>لوحة التحكم وإضافة فيديو</span>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
