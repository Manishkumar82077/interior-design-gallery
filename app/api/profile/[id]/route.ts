import { NextRequest, NextResponse } from "next/server";
import { getProfileWithGalleries } from "@/app/services/getProfileWithGalleries";

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
 
  // ✅ IMPORTANT: await params
  const { id } = await context.params;
 
  if (!id) {
     return NextResponse.json(
      { error: "Profile id is required" },
      { status: 400 }
    );
  }

  try {
     const data = await getProfileWithGalleries(id);

 
    if (!data) {
       return NextResponse.json(null, { status: 404 });
    }

     return NextResponse.json(data);
  } catch (error) {
     return NextResponse.json(
      { error: `Internal server error: ${error}` },
      { status: 500 }
    );
  }
}
