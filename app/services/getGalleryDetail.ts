import { GalleryDetail } from "../lib/types";

export default async function getGalleryDetail(
  id: string
): Promise<GalleryDetail | null> {
  try {
    const response = await fetch(`/api/gallery/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}
