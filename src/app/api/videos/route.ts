import { NextRequest, NextResponse } from "next/server";
import { getVideos, addVideo } from "@/lib/data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "16", 10);

    let videos = getVideos();

    if (category && category !== "الكل" && category !== "all") {
      videos = videos.filter((v) => v.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      videos = videos.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q) ||
          (v.tags && v.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    const total = videos.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginatedVideos = videos.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      success: true,
      videos: paginatedVideos,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("GET /api/videos error:", error);
    return NextResponse.json({ success: false, message: "فشل في جلب الفيديوهات" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, videoUrl, thumbnailUrl, duration, category, tags, description } = body;

    if (!title || !videoUrl || !thumbnailUrl) {
      return NextResponse.json(
        { success: false, message: "يرجى ملء جميع الحقول المطلوبة (العنوان، رابط الفيديو، ورابط الصورة المصغرة)" },
        { status: 400 }
      );
    }

    const newVideo = addVideo({
      title,
      videoUrl,
      thumbnailUrl,
      duration: duration || "05:00",
      category: category || "منوعات وجديد",
      tags: Array.isArray(tags) ? tags : typeof tags === "string" ? tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
      description: description || "",
    });

    return NextResponse.json({
      success: true,
      message: "تم إضافة الفيديو بنجاح",
      video: newVideo,
    });
  } catch (error) {
    console.error("POST /api/videos error:", error);
    return NextResponse.json({ success: false, message: "فشل في إضافة الفيديو" }, { status: 500 });
  }
}
