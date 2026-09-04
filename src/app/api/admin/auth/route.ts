import { NextRequest, NextResponse } from "next/server";
import { getSettings } from "@/lib/data";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pin } = body;
    const settings = getSettings();

    if (!pin) {
      return NextResponse.json({ success: false, message: "يرجى إدخال كلمة المرور" }, { status: 400 });
    }

    if (pin === settings.adminPin) {
      return NextResponse.json({ success: true, message: "تم تسجيل الدخول بنجاح" });
    } else {
      return NextResponse.json({ success: false, message: "كلمة المرور غير صحيحة" }, { status: 401 });
    }
  } catch (error) {
    console.error("POST /api/admin/auth error:", error);
    return NextResponse.json({ success: false, message: "خطأ في السيرفر" }, { status: 500 });
  }
}
