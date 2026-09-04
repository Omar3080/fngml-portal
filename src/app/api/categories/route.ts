import { NextRequest, NextResponse } from "next/server";
import { getCategories, addCategory, deleteCategory, getVideos } from "@/lib/data";

export async function GET() {
  try {
    const categories = getCategories();
    const videos = getVideos();

    const categoriesWithCount = categories.map((cat) => {
      const count =
        cat.name === "الكل" || cat.slug === "all"
          ? videos.length
          : videos.filter((v) => v.category === cat.name).length;
      return { ...cat, count };
    });

    return NextResponse.json({ success: true, categories: categoriesWithCount });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json({ success: false, message: "فشل في جلب الأقسام" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, message: "اسم القسم مطلوب" }, { status: 400 });
    }

    const newCat = addCategory(name.trim());
    return NextResponse.json({ success: true, category: newCat });
  } catch (error) {
    console.error("POST /api/categories error:", error);
    return NextResponse.json({ success: false, message: "فشل في إضافة القسم" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "معرف القسم مطلوب" }, { status: 400 });
    }

    const success = deleteCategory(id);
    if (!success) {
      return NextResponse.json({ success: false, message: "القسم غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "تم حذف القسم بنجاح" });
  } catch (error) {
    console.error("DELETE /api/categories error:", error);
    return NextResponse.json({ success: false, message: "فشل في حذف القسم" }, { status: 500 });
  }
}
