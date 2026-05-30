-- Mevcut veritabanına: relatedIds sütunu + Quote tablosu
-- Supabase SQL Editor'da çalıştır

ALTER TABLE "ThoughtNode" ADD COLUMN IF NOT EXISTS "relatedIds" TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS "Quote" (
  "id"          TEXT NOT NULL,
  "text"        TEXT NOT NULL,
  "author"      TEXT NOT NULL DEFAULT '',
  "sortOrder"   INTEGER NOT NULL DEFAULT 0,
  "published"   BOOLEAN NOT NULL DEFAULT true,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Quote_published_idx" ON "Quote"("published");

-- İsteğe bağlı örnek sözler
INSERT INTO "Quote" ("id", "text", "author", "sortOrder", "published", "createdAt", "updatedAt")
VALUES
(
  'clquote000000000000000001',
  'Düşünmek, cevap aramaktan önce soruyu taşımaktır.',
  '',
  0,
  true,
  NOW(),
  NOW()
),
(
  'clquote000000000000000002',
  'Her cevap, yeni bir sorunun kapısıdır.',
  '',
  1,
  true,
  NOW(),
  NOW()
)
ON CONFLICT ("id") DO NOTHING;
