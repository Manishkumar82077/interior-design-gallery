// app/lib/types.ts

export interface DigitalProfile {
  id: number;
  contractor_uuid: string;
  profile_name: string;
  profile_picture: string | null;
  total_photo_uploaded: number;
  created_at: string;
  updated_at: string;
}

export interface GalleryTag {
  id: number;
  tag: string;
  tag_display_name: string;
  type: string;
}

export interface GalleryImage {
  id: number;
  media_url: string;
  created_at: string;
  updated_at: string;
  created_by_user_id: string;
  profile_name: string;
  profile_picture: string | null;
  tags: GalleryTag[];
  total_photos: number;
}

export interface GalleryDetail extends GalleryImage {
  similar_images: GalleryImage[];
}