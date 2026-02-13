import pool from '@/app/lib/db';
import { GalleryImage } from '@/app/lib/types';
import { RowDataPacket } from 'mysql2';

export async function getProfileWithGalleries(contractorUuid: string) {
  if (!contractorUuid) {
    throw new Error('contractorUuid is required');
  }

  // -------- PROFILE --------
  const [profileRows] = await pool.query<RowDataPacket[]>(
    `
    SELECT 
      dp.id,
      dp.contractor_uuid,
      dp.profile_name,
      dp.profile_picture,
      dp.total_photo_uploaded,
      dp.created_at,
      dp.updated_at,
      (
        SELECT pmg.media_url
        FROM project_media_galleries pmg
        WHERE pmg.created_by_user_id = dp.contractor_uuid
        ORDER BY pmg.created_at DESC
        LIMIT 1
      ) AS cover_image
    FROM digital_profiles dp
    WHERE dp.contractor_uuid = ?
    LIMIT 1
    `,
    [contractorUuid]
  );

  if (!profileRows.length) {
    return null;
  }

  const profile = profileRows[0];

  // -------- GALLERIES --------
  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT 
      pmg.id,
      pmg.media_url,
      pmg.created_at,
      pmg.updated_at,
      pmg.created_by_user_id,
      dp.profile_name,
      dp.profile_picture,
      dp.total_photo_uploaded AS total_photos,
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
          INNER JOIN project_gallery_tags pgt
            ON pmgtl.project_gallery_tag_id = pgt.id
          WHERE pmgtl.project_media_gallery_id = pmg.id
        ),
        JSON_ARRAY()
      ) AS tags
    FROM project_media_galleries pmg
    INNER JOIN digital_profiles dp
      ON pmg.created_by_user_id = dp.contractor_uuid
    WHERE pmg.created_by_user_id = ?
    ORDER BY pmg.created_at DESC
    `,
    [contractorUuid]
  );

  const galleries: GalleryImage[] = rows.map((row) => ({
    id: row.id,
    media_url: row.media_url,
    created_at: row.created_at,
    updated_at: row.updated_at,
    created_by_user_id: row.created_by_user_id,
    profile_name: row.profile_name,
    profile_picture: row.profile_picture,
    total_photos: row.total_photos,
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
  }));

  return { profile, galleries };
}
