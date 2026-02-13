import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing url", { status: 400 });
  }

  const response = await fetch(url);

  if (!response.ok) {
    return new NextResponse("Failed to fetch image", { status: 500 });
  }

  const blob = await response.blob();

  return new NextResponse(blob, {
    headers: {
      "Content-Type": blob.type,
      "Content-Disposition": "attachment",
    },
  });
}
