/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/galleries/route.ts

import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { GalleryImage, GalleryTag } from '@/app/lib/types';
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get('tagId');

    let query = `
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
    `;

    const params: any[] = [];

    if (tagId && tagId !== 'all') {
      query += `
        INNER JOIN project_media_galleries_tag_id_links pmgtl 
          ON pmg.id = pmgtl.project_media_gallery_id
        WHERE pmgtl.project_gallery_tag_id = ?
      `;
      params.push(tagId);
    }

    query += ` ORDER BY pmg.created_at DESC LIMIT 100`;

    const [galleries] = await pool.query<GalleryRow[]>(query, params);

    // Fetch tags for each gallery
    const galleriesWithTags: GalleryImage[] = await Promise.all(
      galleries.map(async (gallery): Promise<GalleryImage> => {
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
          [gallery.id]
        );

        return {
          id: gallery.id,
          media_url: gallery.media_url,
          created_at: gallery.created_at,
          updated_at: gallery.updated_at,
          created_by_user_id: gallery.created_by_user_id,
          profile_name: gallery.profile_name,
          profile_picture: gallery.profile_picture,
          total_photos: gallery.total_photos,
          tags: tags as GalleryTag[],
        };
      })
    );

    return NextResponse.json(galleriesWithTags);
  } catch (error) {
    console.error('Error fetching galleries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch galleries' },
      { status: 500 }
    );
  }
}