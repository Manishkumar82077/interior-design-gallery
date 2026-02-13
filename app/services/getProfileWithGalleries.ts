// app/services/profile.ts

import pool from '@/app/lib/db';
import {
  DigitalProfile,
  GalleryImage,
  ProfileWithGalleries,
} from '@/app/lib/types';
import { RowDataPacket } from 'mysql2';

export async function getProfileWithGalleries(
  contractorUuid: string
): Promise<ProfileWithGalleries | null> {
  if (!contractorUuid) {
    throw new Error('contractorUuid is required');
  }

  const [rows] = await pool.query<RowDataPacket[]>(
    `
    SELECT
      pmg.id,
      pmg.media_url,
      pmg.created_at,
      pmg.updated_at,
      pmg.created_by_user_id,

      dp.id AS profile_id,
      dp.contractor_uuid,
      dp.profile_name,
      dp.profile_picture,
      dp.total_photo_uploaded,
      dp.created_at AS profile_created_at,
      dp.updated_at AS profile_updated_at,

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
          JOIN project_gallery_tags pgt
            ON pmgtl.project_gallery_tag_id = pgt.id
          WHERE pmgtl.project_media_gallery_id = pmg.id
        ),
        JSON_ARRAY()
      ) AS tags
    FROM project_media_galleries pmg
    JOIN digital_profiles dp
      ON dp.contractor_uuid = pmg.created_by_user_id
    WHERE pmg.created_by_user_id = ?
    ORDER BY pmg.id DESC
    `,
    [contractorUuid]
  );

  if (!rows.length) {
    return null; // no galleries → no profile
  }

  /* -------- PROFILE (PURE DB FIELDS) -------- */
  const profile: DigitalProfile = {
    id: rows[0].profile_id,
    contractor_uuid: rows[0].contractor_uuid,
    profile_name: rows[0].profile_name,
    profile_picture: rows[0].profile_picture,
    total_photo_uploaded: rows[0].total_photo_uploaded,
    created_at: rows[0].profile_created_at,
    updated_at: rows[0].profile_updated_at,
  };

  /* -------- GALLERIES -------- */
  const galleries: GalleryImage[] = rows.map((row) => ({
    id: row.id,
    media_url: row.media_url,
    created_at: row.created_at,
    updated_at: row.updated_at,
    created_by_user_id: row.created_by_user_id,
    profile_name: row.profile_name,
    profile_picture: row.profile_picture,
    total_photos: row.total_photo_uploaded,
    tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
  }));

  return {
    profile,
    galleries,
  };
}
