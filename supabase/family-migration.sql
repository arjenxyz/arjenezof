-- Aile alanı: FamilyMessage + FamilyCredential tabloları
-- Supabase SQL Editor'da çalıştır

CREATE TABLE IF NOT EXISTS "FamilyMessage" (
  "id"          TEXT NOT NULL,
  "title"       TEXT NOT NULL,
  "content"     TEXT NOT NULL,
  "audience"    TEXT NOT NULL,
  "sortOrder"   INTEGER NOT NULL DEFAULT 0,
  "published"   BOOLEAN NOT NULL DEFAULT true,
  "authorRole"  TEXT NOT NULL DEFAULT 'admin',
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FamilyMessage_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "FamilyMessage_audience_check" CHECK ("audience" IN ('wife', 'children', 'grandchildren')),
  CONSTRAINT "FamilyMessage_authorRole_check" CHECK ("authorRole" IN ('admin', 'wife'))
);

CREATE INDEX IF NOT EXISTS "FamilyMessage_audience_idx" ON "FamilyMessage"("audience");
CREATE INDEX IF NOT EXISTS "FamilyMessage_published_idx" ON "FamilyMessage"("published");

CREATE TABLE IF NOT EXISTS "FamilyCredential" (
  "role"          TEXT NOT NULL,
  "passwordHash"  TEXT NOT NULL,
  "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FamilyCredential_pkey" PRIMARY KEY ("role"),
  CONSTRAINT "FamilyCredential_role_check" CHECK ("role" IN ('wife', 'children', 'grandchildren'))
);
