-- Aile mesinlerine görsel / ses / video (opsiyonel)
-- Supabase SQL Editor'da çalıştır
--
-- Storage: Dashboard → Storage → New bucket → "family-media" → Public bucket
-- (Dosya yükleme service_role ile yapılır; okuma herkese açık URL ile)

ALTER TABLE "FamilyMessage"
  ADD COLUMN IF NOT EXISTS "mediaUrl" TEXT NOT NULL DEFAULT '';

ALTER TABLE "FamilyMessage"
  ADD COLUMN IF NOT EXISTS "mediaType" TEXT NOT NULL DEFAULT '';

ALTER TABLE "FamilyMessage"
  DROP CONSTRAINT IF EXISTS "FamilyMessage_mediaType_check";

ALTER TABLE "FamilyMessage"
  ADD CONSTRAINT "FamilyMessage_mediaType_check"
  CHECK ("mediaType" IN ('', 'image', 'audio', 'video'));
