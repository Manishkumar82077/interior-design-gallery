/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/galleries/route.ts

import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { GalleryImage } from '@/app/lib/types';
import { RowDataPacket } from 'mysql2';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get('tagId');

    /**
     * OPTIMIZATION:
     * 1. Use LEFT JOIN to get tags in the same query.
     * 2. Use JSON_ARRAYAGG to format tags as a JSON array directly in MySQL.
     * 3. Use a Subquery if tagId is provided to maintain correct filtering logic.
     */
    let query = `
      SELECT 
        pmg.id,
        pmg.media_url,
        pmg.created_at,
        pmg.updated_at,
        pmg.created_by_user_id,
        dp.profile_name,
        dp.profile_picture,
        dp.total_photo_uploaded as total_photos,
        -- Aggregate tags into a JSON string
        COALESCE(
          (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', pgt.id,
                'tag', pgt.tag,
                'tag_display_name', pgt.tag_display_name,
                'type', pgt.type
              )
            )
            FROM project_media_galleries_tag_id_links pmgtl
            INNER JOIN project_gallery_tags pgt ON pmgtl.project_gallery_tag_id = pgt.id
            WHERE pmgtl.project_media_gallery_id = pmg.id
          ), 
          JSON_ARRAY()
        ) as tags
      FROM project_media_galleries pmg
      INNER JOIN digital_profiles dp 
        ON pmg.created_by_user_id = dp.contractor_uuid
    `;

    const params: any[] = [];

    if (tagId && tagId !== 'all') {
      // Filter galleries that have the specific tag
      query += `
        INNER JOIN project_media_galleries_tag_id_links filter_tags 
          ON pmg.id = filter_tags.project_media_gallery_id
        WHERE filter_tags.project_gallery_tag_id = ?
      `;
      params.push(tagId);
    }

    query += ` ORDER BY pmg.created_at DESC LIMIT 100`;

    const [rows] = await pool.query<RowDataPacket[]>(query, params);

    // MySQL JSON_ARRAYAGG might return a string or an object depending on the driver configuration
    const galleriesWithTags: GalleryImage[] = rows.map((row) => ({
      id: row.id,
      media_url: row.media_url,
      created_at: row.created_at,
      updated_at: row.updated_at,
      created_by_user_id: row.created_by_user_id,
      profile_name: row.profile_name,
      profile_picture: row.profile_picture,
      total_photos: row.total_photos,
      // Parse JSON if the driver returns it as a string
      tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
    }));

    return NextResponse.json(galleriesWithTags);
  } catch (error) {
    console.error('Error fetching galleries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch galleries' },
      { status: 500 }
    );
  }
}