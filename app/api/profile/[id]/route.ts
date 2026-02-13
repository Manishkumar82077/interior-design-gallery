import { NextRequest, NextResponse } from "next/server";
import { getProfileWithGalleries } from "@/app/services/getProfileWithGalleries";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  console.log("➡️ GET /api/profile/[id] called");

  // ✅ IMPORTANT: await params
  const { id } = await context.params;
  console.log("📌 Profile ID:", id);

  if (!id) {
    console.warn("⚠️ Missing profile id");
    return NextResponse.json(
      { error: "Profile id is required" },
      { status: 400 }
    );
  }

  try {
    console.log("🔍 Fetching profile with galleries...");
    const data = await getProfileWithGalleries(id);

    console.log("✅ Service response:", data);

    if (!data) {
      console.warn("❌ Profile not found for id:", id);
      return NextResponse.json(null, { status: 404 });
    }

    console.log("📤 Sending response");
    return NextResponse.json(data);
  } catch (error) {
    console.error("🔥 GET /api/profile/[id] failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
