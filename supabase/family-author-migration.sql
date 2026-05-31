-- Mevcut FamilyMessage tablosuna yazar alanı (eşin kendi yazıları)
-- Supabase SQL Editor'da çalıştır

ALTER TABLE "FamilyMessage"
  ADD COLUMN IF NOT EXISTS "authorRole" TEXT NOT NULL DEFAULT 'admin';

ALTER TABLE "FamilyMessage"
  DROP CONSTRAINT IF EXISTS "FamilyMessage_authorRole_check";

ALTER TABLE "FamilyMessage"
  ADD CONSTRAINT "FamilyMessage_authorRole_check"
  CHECK ("authorRole" IN ('admin', 'wife'));

CREATE INDEX IF NOT EXISTS "FamilyMessage_authorRole_idx" ON "FamilyMessage"("authorRole");
