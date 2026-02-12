/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/gallery/[id]/route.ts

import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { GalleryDetail, GalleryImage, GalleryTag } from '@/app/lib/types';
import { RowDataPacket } from 'mysql2';

interface GalleryRow extends RowDataPacket {
  id: number;
  media_url: string;
  created_at: string;
  updated_at: string;
  created_by_user_id: string;
  profile_name: string;
  profile_picture: string | null;
  total_photos: number;
}

interface TagRow extends RowDataPacket {
  id: number;
  tag: string;
  tag_display_name: string;
  type: string;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: galleryId } = await context.params;

    // Fetch main gallery details
    const [galleries] = await pool.query<GalleryRow[]>(
      `
      SELECT 
        pmg.id,
        pmg.media_url,
        pmg.created_at,
        pmg.updated_at,
        pmg.created_by_user_id,
        dp.profile_name,
        dp.profile_picture,
        dp.total_photo_uploaded as total_photos
      FROM project_media_galleries pmg
      INNER JOIN digital_profiles dp 
        ON pmg.created_by_user_id = dp.contractor_uuid
      WHERE pmg.id = ?
    `,
      [galleryId]
    );

    if (!galleries || galleries.length === 0) {
      return NextResponse.json(
        { error: 'Gallery not found' },
        { status: 404 }
      );
    }

    const gallery = galleries[0];

    // Fetch tags for this gallery
    const [tags] = await pool.query<TagRow[]>(
      `
      SELECT DISTINCT
        pgt.id,
        pgt.tag,
        pgt.tag_display_name,
        pgt.type
      FROM project_gallery_tags pgt
      INNER JOIN project_media_galleries_tag_id_links pmgtl 
        ON pgt.id = pmgtl.project_gallery_tag_id
      WHERE pmgtl.project_media_gallery_id = ?
    `,
      [galleryId]
    );

    // Fetch similar images (images with same tags)
    const tagIds = tags.map((tag) => tag.id);
    
    let similarImages: GalleryImage[] = [];
    if (tagIds.length > 0) {
      const placeholders = tagIds.map(() => '?').join(',');
      const [similar] = await pool.query<GalleryRow[]>(
        `
        SELECT DISTINCT
          pmg.id,
          pmg.media_url,
          pmg.created_at,
          pmg.updated_at,
          pmg.created_by_user_id,
          dp.profile_name,
          dp.profile_picture,
          dp.total_photo_uploaded as total_photos
        FROM project_media_galleries pmg
        INNER JOIN digital_profiles dp 
          ON pmg.created_by_user_id = dp.contractor_uuid
        INNER JOIN project_media_galleries_tag_id_links pmgtl 
          ON pmg.id = pmgtl.project_media_gallery_id
        WHERE pmgtl.project_gallery_tag_id IN (${placeholders})
          AND pmg.id != ?
        ORDER BY pmg.created_at DESC
        LIMIT 10
      `,
        [...tagIds, galleryId]
      );

      // Fetch tags for similar images
      similarImages = await Promise.all(
        similar.map(async (img): Promise<GalleryImage> => {
          const [imgTags] = await pool.query<TagRow[]>(
            `
            SELECT DISTINCT
              pgt.id,
              pgt.tag,
              pgt.tag_display_name,
              pgt.type
            FROM project_gallery_tags pgt
            INNER JOIN project_media_galleries_tag_id_links pmgtl 
              ON pgt.id = pmgtl.project_gallery_tag_id
            WHERE pmgtl.project_media_gallery_id = ?
          `,
            [img.id]
          );

          return {
            id: img.id,
            media_url: img.media_url,
            created_at: img.created_at,
            updated_at: img.updated_at,
            created_by_user_id: img.created_by_user_id,
            profile_name: img.profile_name,
            profile_picture: img.profile_picture,
            total_photos: img.total_photos,
            tags: imgTags as GalleryTag[],
          };
        })
      );
    }

    const result: GalleryDetail = {
      id: gallery.id,
      media_url: gallery.media_url,
      created_at: gallery.created_at,
      updated_at: gallery.updated_at,
      created_by_user_id: gallery.created_by_user_id,
      profile_name: gallery.profile_name,
      profile_picture: gallery.profile_picture,
      total_photos: gallery.total_photos,
      tags: tags as GalleryTag[],
      similar_images: similarImages,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching gallery detail:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery detail' },
      { status: 500 }
    );
  }
}