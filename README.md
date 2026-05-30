# Bu düşüncelerde ne?

Arjen Esen'in akıl denemelerini şema ve metin olarak paylaştığı kişisel düşünce sitesi.

## Özellikler

- **Şema görünümü:** Tüm düşünce ağacını interaktif haritada gör (salt okunur)
- **Liste görünümü:** Hiyerarşik metin listesi
- **Detay sayfaları:** Her düşüncenin tam metni, etiketleri ve alt dalları
- **Admin paneli:** Sadece sen düşünce ekleyebilir, düzenleyebilir ve silebilirsin
- **Türkçe arayüz**

## Yerel kurulum

```bash
npm install
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

Site: [http://localhost:3000](http://localhost:3000)  
Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Varsayılan şifre `.env` dosyasındaki `ADMIN_PASSWORD` değeridir.

## Admin kullanımı

1. `/admin/login` adresinden giriş yap
2. **Yeni düşünce** ile kök veya alt dal ekle
3. **Sonraki soru** alanına şemada görünecek soruyu yaz (örn. "Yaratıcı var mıdır?")
4. **Dal etiketi** alanına üst düğümden gelen cevabı yaz (örn. "Evet", "Hayır")
5. **Üst düşünce** seçerek ağaca bağla

## Vercel'e deploy

SQLite Vercel'de kalıcı çalışmaz. Üretim için ücretsiz **Neon PostgreSQL** önerilir:

1. [neon.tech](https://neon.tech) üzerinde veritabanı oluştur
2. `prisma/schema.prisma` içinde `provider = "postgresql"` yap
3. Vercel ortam değişkenlerini ayarla:
   - `DATABASE_URL` — Neon bağlantı dizesi
   - `ADMIN_PASSWORD` — güçlü şifre
   - `ADMIN_SECRET` — en az 32 karakter rastgele anahtar
4. Deploy sonrası bir kez migration çalıştır:
   ```bash
   npx prisma db push
   npx tsx prisma/seed.ts
   ```

## Teknoloji

- Next.js 16 (App Router)
- Prisma + SQLite (yerel) / PostgreSQL (üretim)
- React Flow (şema görselleştirme)
- Tailwind CSS
