import { NextRequest, NextResponse } from "next/server";
import { getVideoById, deleteVideo, updateVideo, incrementViews } from "@/lib/data";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const video = getVideoById(id);

    if (!video) {
      return NextResponse.json({ success: false, message: "الفيديو غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ success: true, video });
  } catch (error) {
    console.error("GET /api/videos/[id] error:", error);
    return NextResponse.json({ success: false, message: "خطأ في السيرفر" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.action === "increment_views") {
      incrementViews(id);
      return NextResponse.json({ success: true, message: "تم زيادة عدد المشاهدات" });
    }

    const updated = updateVideo(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, message: "الفيديو غير موجود للتعديل" }, { status: 404 });
    }

    return NextResponse.json({ success: true, video: updated });
  } catch (error) {
    console.error("PATCH /api/videos/[id] error:", error);
    return NextResponse.json({ success: false, message: "فشل في تحديث الفيديو" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = deleteVideo(id);

    if (!success) {
      return NextResponse.json({ success: false, message: "الفيديو غير موجود للحذف" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "تم حذف الفيديو بنجاح" });
  } catch (error) {
    console.error("DELETE /api/videos/[id] error:", error);
    return NextResponse.json({ success: false, message: "فشل في حذف الفيديو" }, { status: 500 });
  }
}
