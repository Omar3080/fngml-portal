import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    template: "%s | الفن والجمال",
    default: "الفن والجمال - صور وفيديوهات حصرية بجودة عالية",
  },
  description: "الموقع الأفضل المتخصص في صور وفيديوهات الفنانات ومشهورات السوشيال ميديا، الفيديوهات الحصرية بأعلى جودة وسرعة مشاهدة فائقة.",
  keywords: ["فيديوهات", "فنانات", "مشهورات", "حصرية", "مشاهدة اونلاين"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="dark">
      <body className="bg-[#0d0d0f] text-zinc-100 min-h-screen flex flex-col selection:bg-rose-600 selection:text-white">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
