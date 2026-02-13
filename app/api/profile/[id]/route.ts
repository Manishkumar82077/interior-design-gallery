// app/api/profile/[id]/route.ts
import { NextResponse } from "next/server";
import { getProfileWithGalleries } from "@/app/services/profile";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: "Profile id is required" },
        { status: 400 }
      );
    }

    const data = await getProfileWithGalleries(id);

    if (!data) {
      return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET /api/profile/[id] failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
