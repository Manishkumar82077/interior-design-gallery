// app/api/tags/route.ts

import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';
import { GalleryTag } from '@/app/lib/types';

export async function GET() {
  try {
    const [rows] = await pool.query(`
      SELECT DISTINCT 
        pgt.id,
        pgt.tag,
        pgt.tag_display_name,
        pgt.type
      FROM project_gallery_tags pgt
      INNER JOIN project_media_galleries_tag_id_links pmgtl 
        ON pgt.id = pmgtl.project_gallery_tag_id
      ORDER BY pgt.tag_display_name ASC
    `);

    return NextResponse.json(rows as GalleryTag[]);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}