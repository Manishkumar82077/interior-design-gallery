// app/api/gallery/[id]/route.ts

import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { GalleryDetail, GalleryImage, GalleryTag } from '@/app/lib/types';
import { RowDataPacket } from 'mysql2';

interface GalleryRow extends RowDataPacket {
  id: number; media_url: string; created_at: string; updated_at: string;
  created_by_user_id: string; profile_name: string; profile_picture: string | null;
  total_photos: number;
}

interface TagRow extends RowDataPacket {
  id: number; tag: string; tag_display_name: string; type: string;
}

interface SimilarImageWithTagsRow extends RowDataPacket {
  id: number; media_url: string; created_at: string; updated_at: string;
  created_by_user_id: string; profile_name: string; profile_picture: string | null;
  total_photos: number;
  tags_json: GalleryTag[] | null; // Already parsed by mysql2
}

export async function getGalleryDetailLogic(galleryId: string): Promise<GalleryDetail | null> {
  
  // Query 1: Get main gallery info
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

  // Query 2: Get tags for main gallery
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
    
    // Fetch similar images WITH their tags in ONE query
    const [similar] = await pool.query<SimilarImageWithTagsRow[]>(
      `SELECT 
        pmg.id, 
        pmg.media_url, 
        pmg.created_at, 
        pmg.updated_at, 
        pmg.created_by_user_id, 
        dp.profile_name, 
        dp.profile_picture, 
        dp.total_photo_uploaded as total_photos,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'id', pgt.id,
            'tag', pgt.tag,
            'tag_display_name', pgt.tag_display_name,
            'type', pgt.type
          )
        ) as tags_json
       FROM project_media_galleries pmg
       INNER JOIN digital_profiles dp 
         ON pmg.created_by_user_id = dp.contractor_uuid
       INNER JOIN project_media_galleries_tag_id_links pmgtl 
         ON pmg.id = pmgtl.project_media_gallery_id
       INNER JOIN project_gallery_tags pgt 
         ON pmgtl.project_gallery_tag_id = pgt.id
       WHERE pmgtl.project_gallery_tag_id IN (${placeholders}) 
         AND pmg.id != ?
       GROUP BY pmg.id, pmg.media_url, pmg.created_at, pmg.updated_at, 
                pmg.created_by_user_id, dp.profile_name, dp.profile_picture, 
                dp.total_photo_uploaded
       ORDER BY pmg.created_at DESC 
       LIMIT 10`,
      [...tagIds, galleryId]
    );

    // mysql2 already parses JSON, so tags_json is already an array
    similarImages = similar.map((img): GalleryImage => {
      const tags = img.tags_json || [];
      
      // Remove duplicate tags (in case of multiple tag matches)
      const uniqueTags = Array.from(
        new Map(tags.map((tag: GalleryTag) => [tag.id, tag])).values()
      ) as GalleryTag[];

      return {
        id: img.id,
        media_url: img.media_url,
        created_at: img.created_at,
        updated_at: img.updated_at,
        created_by_user_id: img.created_by_user_id,
        profile_name: img.profile_name,
        profile_picture: img.profile_picture,
        total_photos: img.total_photos,
        tags: uniqueTags
      };
    });
  }

  return {
    ...gallery,
    tags: tags as GalleryTag[],
    similar_images: similarImages,
  } as GalleryDetail;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: galleryId } = await context.params;
    const data = await getGalleryDetailLogic(galleryId);

    if (!data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(data);
  } catch (error) {
    console.error('Gallery detail error:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}