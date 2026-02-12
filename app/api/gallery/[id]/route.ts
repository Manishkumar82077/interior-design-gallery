// app/api/gallery/[id]/route.ts

import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { GalleryDetail, GalleryImage, GalleryTag } from '@/app/lib/types';
import { RowDataPacket } from 'mysql2';

// 1. Keep your interfaces inside the file
interface GalleryRow extends RowDataPacket {
  id: number; media_url: string; created_at: string; updated_at: string;
  created_by_user_id: string; profile_name: string; profile_picture: string | null;
  total_photos: number;
}
interface TagRow extends RowDataPacket {
  id: number; tag: string; tag_display_name: string; type: string;
}

// 2. EXPORT THE LOGIC FUNCTION
// This allows the Page to call this function without using 'fetch'
export async function getGalleryDetailLogic(galleryId: string): Promise<GalleryDetail | null> {
  // --- PASTE YOUR EXACT QUERY LOGIC HERE ---
  const [galleries] = await pool.query<GalleryRow[]>(
    `SELECT pmg.id, pmg.media_url, pmg.created_at, pmg.updated_at, pmg.created_by_user_id, 
            dp.profile_name, dp.profile_picture, dp.total_photo_uploaded as total_photos
     FROM project_media_galleries pmg
     INNER JOIN digital_profiles dp ON pmg.created_by_user_id = dp.contractor_uuid
     WHERE pmg.id = ?`,
    [galleryId]
  );

  if (!galleries || galleries.length === 0) return null;
  const gallery = galleries[0];

  const [tags] = await pool.query<TagRow[]>(
    `SELECT DISTINCT pgt.id, pgt.tag, pgt.tag_display_name, pgt.type
     FROM project_gallery_tags pgt
     INNER JOIN project_media_galleries_tag_id_links pmgtl ON pgt.id = pmgtl.project_gallery_tag_id
     WHERE pmgtl.project_media_gallery_id = ?`,
    [galleryId]
  );

  const tagIds = tags.map((tag) => tag.id);
  let similarImages: GalleryImage[] = [];
  
  if (tagIds.length > 0) {
    const placeholders = tagIds.map(() => '?').join(',');
    const [similar] = await pool.query<GalleryRow[]>(
      `SELECT DISTINCT pmg.id, pmg.media_url, pmg.created_at, pmg.updated_at, pmg.created_by_user_id, 
              dp.profile_name, dp.profile_picture, dp.total_photo_uploaded as total_photos
       FROM project_media_galleries pmg
       INNER JOIN digital_profiles dp ON pmg.created_by_user_id = dp.contractor_uuid
       INNER JOIN project_media_galleries_tag_id_links pmgtl ON pmg.id = pmgtl.project_media_gallery_id
       WHERE pmgtl.project_gallery_tag_id IN (${placeholders}) AND pmg.id != ?
       ORDER BY pmg.created_at DESC LIMIT 10`,
      [...tagIds, galleryId]
    );

    similarImages = await Promise.all(
      similar.map(async (img): Promise<GalleryImage> => {
        const [imgTags] = await pool.query<TagRow[]>(
          `SELECT DISTINCT pgt.id, pgt.tag, pgt.tag_display_name, pgt.type
           FROM project_gallery_tags pgt
           INNER JOIN project_media_galleries_tag_id_links pmgtl ON pgt.id = pmgtl.project_gallery_tag_id
           WHERE pmgtl.project_media_gallery_id = ?`, [img.id]
        );
        return { ...img, tags: imgTags as GalleryTag[] };
      })
    );
  }

  return {
    ...gallery,
    tags: tags as GalleryTag[],
    similar_images: similarImages,
  } as GalleryDetail;
}

// 3. THE STANDARD GET HANDLER
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: galleryId } = await context.params;
    const data = await getGalleryDetailLogic(galleryId);

    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}