-- Mevcut FamilyMessage tablosuna yazar alanı (eşin kendi yazıları)
-- Supabase SQL Editor'da çalıştır
--
-- Eşin daha önce yazdığı metinler "admin" olarak kalmışsa, hangileri onun
-- olduğunu biliyorsan şu komutla düzeltebilirsin (id'yi değiştir):
-- UPDATE "FamilyMessage" SET "authorRole" = 'wife' WHERE "id" = '...';

ALTER TABLE "FamilyMessage"
  ADD COLUMN IF NOT EXISTS "authorRole" TEXT NOT NULL DEFAULT 'admin';

ALTER TABLE "FamilyMessage"
  DROP CONSTRAINT IF EXISTS "FamilyMessage_authorRole_check";

ALTER TABLE "FamilyMessage"
  ADD CONSTRAINT "FamilyMessage_authorRole_check"
  CHECK ("authorRole" IN ('admin', 'wife'));

CREATE INDEX IF NOT EXISTS "FamilyMessage_authorRole_idx" ON "FamilyMessage"("authorRole");
