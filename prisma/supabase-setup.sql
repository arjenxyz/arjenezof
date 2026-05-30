-- Supabase → SQL Editor → New query → yapıştır → Run
-- Tablo + örnek düşünce ağacı

DROP TABLE IF EXISTS "ThoughtNode" CASCADE;

CREATE TABLE "ThoughtNode" (
  "id"             TEXT NOT NULL,
  "title"          TEXT NOT NULL,
  "slug"           TEXT NOT NULL,
  "content"        TEXT NOT NULL,
  "branchQuestion" TEXT,
  "branchLabel"    TEXT,
  "sortOrder"      INTEGER NOT NULL DEFAULT 0,
  "tags"           TEXT NOT NULL DEFAULT '',
  "published"      BOOLEAN NOT NULL DEFAULT true,
  "parentId"       TEXT,
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ThoughtNode_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ThoughtNode_slug_key" ON "ThoughtNode"("slug");
CREATE INDEX "ThoughtNode_parentId_idx" ON "ThoughtNode"("parentId");
CREATE INDEX "ThoughtNode_published_idx" ON "ThoughtNode"("published");

ALTER TABLE "ThoughtNode"
  ADD CONSTRAINT "ThoughtNode_parentId_fkey"
  FOREIGN KEY ("parentId") REFERENCES "ThoughtNode"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Örnek veri (isteğe bağlı — sadece tablo istiyorsan bu bölümü sil)

INSERT INTO "ThoughtNode" (
  "id", "title", "slug", "content", "branchQuestion", "branchLabel",
  "sortOrder", "tags", "published", "parentId", "createdAt", "updatedAt"
) VALUES
(
  'clroot00000000000000000001',
  'Yaratıcı nedir?',
  'yaratici-nedir',
  'Yaratıcı kavramı, var olan her şeyin ötesinde bir kaynak arayışının ta kendisidir.
Bazen bir kişi, bazen bir güç, bazen de yalnızca evrenin kendi düzenini kuran sessiz bir ilke
olarak düşünürüm onu.

Bu soru benim için bir cevap değil, bir kapı. Kapıdan geçmeden önce neyi "yaratılmış"
saydığımı sorgulamam gerekir: madde mi, bilinç mi, düzen mi?

Not: Bu düşünceler zamanla değişebilir. Yanlış olabilir, eksik kalabilir — bu normaldir.',
  'Yaratıcı var mıdır?',
  NULL,
  0,
  'din, felsefe, varoluş',
  true,
  NULL,
  NOW(),
  NOW()
),
(
  'clnode00000000000000000002',
  'Evet — bir yaratıcı vardır',
  'evet-yaratici-vardir',
  'Bu yola "evet" dediğimde, evrenin rastlantıdan ibaret olmadığı hissine yaslanırım.
Düzenin inceliği, yaşamın direnci, bilincin varlığı… bunların ardında bir niyet, bir irade
veya en azından bir "ilk neden" ararım.

Henüz bu yaratıcının kim olduğunu, tek mi çok mu olduğunu netleştirmedim.
Önce varlığını kabul etmek, sonraki soruları açar.',
  'Bu yaratıcı kişisel midir?',
  'Evet',
  0,
  'din, inanç',
  true,
  'clroot00000000000000000001',
  NOW(),
  NOW()
),
(
  'clnode00000000000000000003',
  'Hayır — yaratıcı yoktur',
  'hayir-yaratici-yoktur',
  'Bu yola "hayır" dediğimde, evreni kendi kendine yeterli bir sistem olarak görürüm.
Doğa yasaları, zaman, tesadüf ve seleksiyon — bunlar açıklayıcı olabilir mi?

Burada dikkat etmem gereken şey: "yaratıcı yok" demek, "anlam yok" demek değildir.
Anlam, insan zihninin dünyayla kurduğu ilişkide de doğabilir.',
  NULL,
  'Hayır',
  1,
  'doğa, bilim, felsefe',
  true,
  'clroot00000000000000000001',
  NOW(),
  NOW()
),
(
  'clnode00000000000000000004',
  'Kişisel bir yaratıcı',
  'kisisel-yaratici',
  'Yaratıcının kişisel olması, O''nun beni duyabileceği, umursayabileceği
ve belki bir amaç taşıdığı anlamına gelir. Bu, dua, sorumluluk ve anlam arayışını
derinden etkiler.',
  NULL,
  'Evet',
  0,
  'din, kişisel',
  true,
  'clnode00000000000000000002',
  NOW(),
  NOW()
),
(
  'clnode00000000000000000005',
  'Kişisel olmayan bir ilk neden',
  'kisisel-olmayan-ilk-neden',
  'Belki de yaratıcı bir "kim" değil, bir "ilk ilke"dir — madde, enerji
veya bilinç öncesi bir zorunluluk. Bu yol daha soğuk ama daha evrensel gelebilir.',
  NULL,
  'Hayır',
  1,
  'felsefe, metafizik',
  true,
  'clnode00000000000000000002',
  NOW(),
  NOW()
);
