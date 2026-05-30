# Bu düşüncelerde ne?

Arjen'in akıl denemelerini metin olarak paylaştığı kişisel yazı sitesi.

## Özellikler

- **Konular:** Metinlerini konu konu grupla (serbest konu adı)
- **Etiketler:** İlgi alanlarına göre keşif (`/etiket/kuş` gibi)
- **Bağlantılar:** Metin devamı, benzer okumalar (elle + otomatik etiket eşleşmesi)
- **Hakkında sözleri:** Altta rastgele dönen sözler (admin panelden yönetilir)
- **Admin paneli:** Konu, metin ve söz yönetimi
- **Türkçe arayüz**

## Supabase kurulumu

**Sıfırdan kurulum:** SQL Editor → `prisma/supabase-setup.sql` → Run

**Mevcut veritabanı güncellemeleri:**
1. `supabase/topics-migration.sql` (konu desteği)
2. `supabase/writings-and-quotes-migration.sql` (relatedIds + Quote tablosu)

**Project Settings → API** bölümünden:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **service_role** (gizli anahtar) → `SUPABASE_SERVICE_ROLE_KEY`

```env
NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
ADMIN_PASSWORD="güçlü-şifre"
ADMIN_SECRET="en-az-32-karakter-rastgele-anahtar"
```

> `service_role` anahtarını asla tarayıcıya veya `NEXT_PUBLIC_` ile ekleme. Sadece sunucu tarafında kullanılır.

## Yerel kurulum

```bash
npm install
cp .env.example .env
# .env dosyasını doldur
npm run dev
```

Site: [http://localhost:3000](http://localhost:3000)  
Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Vercel'e deploy

1. GitHub reposunu Vercel'e bağla
2. **Environment Variables** ekle:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`
   - `ADMIN_SECRET`
3. Deploy et

## Admin kullanımı

1. `/admin/login` adresinden giriş yap
2. **Konular** — konu başlığı ve giriş metni
3. **+ Yeni metin** — konu, başlık, metin, etiketler
4. **Devam ettiği metin** — seri/devam bağlantısı (opsiyonel)
5. **Benzer metinler** — elle bağlantı (etiketler otomatik öneri de üretir)
6. **Sözler** — Hakkında sayfasındaki dönen sözler

## Teknoloji

- Next.js 16 (App Router)
- Supabase (PostgreSQL + REST API)
- Tailwind CSS
