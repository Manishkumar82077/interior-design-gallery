/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/galleries/route.ts
import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { GalleryImage } from '@/app/lib/types';
import { RowDataPacket } from 'mysql2';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tagIdsParam = searchParams.get('tagIds'); 
    const tagIds = tagIdsParam ? tagIdsParam.split(',').filter(id => id !== '') : [];

    let query = `
      SELECT 
        pmg.id, pmg.media_url, pmg.created_at, pmg.updated_at,
        pmg.created_by_user_id, dp.profile_name, dp.profile_picture,
        dp.total_photo_uploaded as total_photos,
        COALESCE(
          (
            SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', pgt.id, 'tag', pgt.tag,
                'tag_display_name', pgt.tag_display_name, 'type', pgt.type
              )
            )
            FROM project_media_galleries_tag_id_links pmgtl
            INNER JOIN project_gallery_tags pgt ON pmgtl.project_gallery_tag_id = pgt.id
            WHERE pmgtl.project_media_gallery_id = pmg.id
          ), 
          JSON_ARRAY()
        ) as tags
      FROM project_media_galleries pmg
      INNER JOIN digital_profiles dp ON pmg.created_by_user_id = dp.contractor_uuid
    `;

    const params: any[] = [];

    if (tagIds.length > 0) {
      const placeholders = tagIds.map(() => '?').join(',');
      query += `
        INNER JOIN project_media_galleries_tag_id_links filter_tags 
          ON pmg.id = filter_tags.project_media_gallery_id
        WHERE filter_tags.project_gallery_tag_id IN (${placeholders})
      `;
      params.push(...tagIds);
    }

    query += ` GROUP BY pmg.id ORDER BY pmg.created_at DESC LIMIT 100`;

    const [rows] = await pool.query<RowDataPacket[]>(query, params);

    const galleriesWithTags: GalleryImage[] = rows.map((row) => ({
      ...row,
      tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
    } as GalleryImage));

    return NextResponse.json(galleriesWithTags);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}