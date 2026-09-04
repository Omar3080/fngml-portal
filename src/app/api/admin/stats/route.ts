import { NextResponse } from "next/server";
import { getVideos, getCategories, getSettings } from "@/lib/data";

export async function GET() {
  try {
    const videos = getVideos();
    const categories = getCategories();
    const settings = getSettings();

    const totalViews = videos.reduce((acc, v) => acc + (v.views || 0), 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalVideos: videos.length,
        totalCategories: categories.length - 1, // excluding "الكل"
        totalViews,
        siteName: settings.siteName,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ success: false, message: "فشل في جلب الإحصائيات" }, { status: 500 });
  }
}
