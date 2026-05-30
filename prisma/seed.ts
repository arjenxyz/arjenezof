import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const url = process.env.DATABASE_URL ?? "file:./dev.db";
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.thoughtNode.deleteMany();

  const root = await prisma.thoughtNode.create({
    data: {
      title: "Yaratıcı nedir?",
      slug: "yaratici-nedir",
      content: `Yaratıcı kavramı, var olan her şeyin ötesinde bir kaynak arayışının ta kendisidir. 
Bazen bir kişi, bazen bir güç, bazen de yalnızca evrenin kendi düzenini kuran sessiz bir ilke 
olarak düşünürüm onu.

Bu soru benim için bir cevap değil, bir kapı. Kapıdan geçmeden önce neyi "yaratılmış" 
saydığımı sorgulamam gerekir: madde mi, bilinç mi, düzen mi?

Not: Bu düşünceler zamanla değişebilir. Yanlış olabilir, eksik kalabilir — bu normaldir.`,
      branchQuestion: "Yaratıcı var mıdır?",
      tags: "din, felsefe, varoluş",
      sortOrder: 0,
    },
  });

  await prisma.thoughtNode.create({
    data: {
      title: "Evet — bir yaratıcı vardır",
      slug: "evet-yaratici-vardir",
      content: `Bu yola "evet" dediğimde, evrenin rastlantıdan ibaret olmadığı hissine yaslanırım. 
Düzenin inceliği, yaşamın direnci, bilincin varlığı… bunların ardında bir niyet, bir irade 
veya en azından bir "ilk neden" ararım.

Henüz bu yaratıcının kim olduğunu, tek mi çok mu olduğunu netleştirmedim. 
Önce varlığını kabul etmek, sonraki soruları açar.`,
      branchLabel: "Evet",
      parentId: root.id,
      branchQuestion: "Bu yaratıcı kişisel midir?",
      tags: "din, inanç",
      sortOrder: 0,
    },
  });

  await prisma.thoughtNode.create({
    data: {
      title: "Hayır — yaratıcı yoktur",
      slug: "hayir-yaratici-yoktur",
      content: `Bu yola "hayır" dediğimde, evreni kendi kendine yeterli bir sistem olarak görürüm. 
Doğa yasaları, zaman, tesadüf ve seleksiyon — bunlar açıklayıcı olabilir mi?

Burada dikkat etmem gereken şey: "yaratıcı yok" demek, "anlam yok" demek değildir. 
Anlam, insan zihninin dünyayla kurduğu ilişkide de doğabilir.`,
      branchLabel: "Hayır",
      parentId: root.id,
      tags: "doğa, bilim, felsefe",
      sortOrder: 1,
    },
  });

  const yesNode = await prisma.thoughtNode.findFirst({
    where: { slug: "evet-yaratici-vardir" },
  });

  if (yesNode) {
    await prisma.thoughtNode.create({
      data: {
        title: "Kişisel bir yaratıcı",
        slug: "kisisel-yaratici",
        content: `Yaratıcının kişisel olması, O'nun beni duyabileceği, umursayabileceği 
ve belki bir amaç taşıdığı anlamına gelir. Bu, dua, sorumluluk ve anlam arayışını 
derinden etkiler.`,
        branchLabel: "Evet",
        parentId: yesNode.id,
        tags: "din, kişisel",
        sortOrder: 0,
      },
    });

    await prisma.thoughtNode.create({
      data: {
        title: "Kişisel olmayan bir ilk neden",
        slug: "kisisel-olmayan-ilk-neden",
        content: `Belki de yaratıcı bir "kim" değil, bir "ilk ilke"dir — madde, enerji 
veya bilinç öncesi bir zorunluluk. Bu yol daha soğuk ama daha evrensel gelebilir.`,
        branchLabel: "Hayır",
        parentId: yesNode.id,
        tags: "felsefe, metafizik",
        sortOrder: 1,
      },
    });
  }

  console.log("Örnek düşünce ağacı oluşturuldu.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
