-- Mevcut veritabanına konu desteği ekler (Supabase SQL Editor'da çalıştır)
-- ThoughtNode tablon ve verilerin varsa bunu kullan; sıfırdan kurulum için supabase-setup.sql

CREATE TABLE IF NOT EXISTS "Topic" (
  "id"          TEXT NOT NULL,
  "title"       TEXT NOT NULL,
  "slug"        TEXT NOT NULL,
  "description" TEXT NOT NULL DEFAULT '',
  "sortOrder"   INTEGER NOT NULL DEFAULT 0,
  "published"   BOOLEAN NOT NULL DEFAULT true,
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Topic_slug_key" ON "Topic"("slug");
CREATE INDEX IF NOT EXISTS "Topic_published_idx" ON "Topic"("published");

ALTER TABLE "ThoughtNode" ADD COLUMN IF NOT EXISTS "topicId" TEXT;

-- Varsayılan konu (mevcut düşünceler buna bağlanır)
INSERT INTO "Topic" ("id", "title", "slug", "description", "sortOrder", "published", "createdAt", "updatedAt")
VALUES (
  'cltopic000000000000000001',
  'Din & inanç',
  'din-inanc',
  'Tanrı, yaratıcı, inanç ve din üzerine akıl denemeleri.',
  0,
  true,
  NOW(),
  NOW()
)
ON CONFLICT ("id") DO NOTHING;

UPDATE "ThoughtNode"
SET "topicId" = 'cltopic000000000000000001'
WHERE "topicId" IS NULL;

-- İsteğe bağlı ek örnek konular
INSERT INTO "Topic" ("id", "title", "slug", "description", "sortOrder", "published", "createdAt", "updatedAt")
VALUES
(
  'cltopic000000000000000002',
  'Doğa & çevre',
  'doga-cevre',
  'Doğa, çevre ve insanın dünyayla ilişkisi üzerine düşünceler.',
  1,
  true,
  NOW(),
  NOW()
),
(
  'cltopic000000000000000003',
  'Varoluş & anlam',
  'varolus-anlam',
  'Yaşamın anlamı, bilinç ve varoluş soruları.',
  2,
  true,
  NOW(),
  NOW()
)
ON CONFLICT ("id") DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ThoughtNode_topicId_fkey'
  ) THEN
    ALTER TABLE "ThoughtNode"
      ADD CONSTRAINT "ThoughtNode_topicId_fkey"
      FOREIGN KEY ("topicId") REFERENCES "Topic"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "ThoughtNode_topicId_idx" ON "ThoughtNode"("topicId");

ALTER TABLE "ThoughtNode" ALTER COLUMN "topicId" SET NOT NULL;
