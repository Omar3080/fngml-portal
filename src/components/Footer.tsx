import Link from "next/link";
import { Flame, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0e0e11] border-t border-[#202025] text-zinc-400 text-sm mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">الفن والجمال</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              الموقع الأفضل المتخصص في صور وفيديوهات الفنانات ومشهورات السوشيال ميديا، الفيديوهات الحصرية بأعلى جودة وسرعة مشاهدة فائقة.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
              روابط سريعة
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-rose-400 transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/category/all" className="hover:text-rose-400 transition-colors">
                  أحدث الفيديوهات
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-rose-400 transition-colors">
                  الأقسام والتصنيفات
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-rose-400 transition-colors">
                  لوحة التحكم
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Info */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-3">
              عن المنصة
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/categories" className="hover:text-rose-400 transition-colors">
                  تصفح كافة الأقسام
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-rose-400 transition-colors">
                  البحث في الفيديوهات
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-rose-400 transition-colors">
                  إدارة المحتوى
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} الفن والجمال. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-1">
            <span>تم التطوير بأعلى معايير الأداء والسرعة</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
