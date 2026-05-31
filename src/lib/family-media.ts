import { createSupabaseAdmin } from "@/lib/supabase";

export const FAMILY_MEDIA_BUCKET = "family-media";

export type FamilyMediaType = "image" | "audio" | "video";

const MAX_BYTES = 25 * 1024 * 1024;

export function detectFamilyMediaType(mimeType: string): FamilyMediaType | null {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.startsWith("video/")) return "video";
  return null;
}

export async function uploadFamilyMedia(file: File) {
  if (file.size > MAX_BYTES) {
    throw new Error("Dosya en fazla 25 MB olabilir.");
  }

  const mediaType = detectFamilyMediaType(file.type);
  if (!mediaType) {
    throw new Error("Yalnızca görsel, ses veya video yükleyebilirsin.");
  }

  const supabase = createSupabaseAdmin();
  const extension = file.name.includes(".") ? file.name.split(".").pop() : "bin";
  const objectPath = `${mediaType}/${Date.now()}-${crypto.randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage.from(FAMILY_MEDIA_BUCKET).upload(objectPath, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    throw new Error(
      error.message.includes("Bucket not found")
        ? 'Storage bucket "family-media" bulunamadı. Supabase Storage\'da public bucket oluştur.'
        : error.message,
    );
  }

  const { data } = supabase.storage.from(FAMILY_MEDIA_BUCKET).getPublicUrl(objectPath);
  return { mediaUrl: data.publicUrl, mediaType };
}
