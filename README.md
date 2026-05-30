# Bu düşüncelerde ne?

Arjen Esen'in akıl denemelerini şema ve metin olarak paylaştığı kişisel düşünce sitesi.

## Özellikler

- **Şema görünümü:** Tüm düşünce ağacını interaktif haritada gör (salt okunur)
- **Liste görünümü:** Hiyerarşik metin listesi
- **Detay sayfaları:** Her düşüncenin tam metni, etiketleri ve alt dalları
- **Admin paneli:** Sadece sen düşünce ekleyebilir, düzenleyebilir ve silebilirsin
- **Türkçe arayüz**

## Supabase kurulumu

1. [supabase.com](https://supabase.com) üzerinde proje oluştur
2. **SQL Editor** → `prisma/supabase-setup.sql` dosyasını yapıştır → **Run**
3. **Project Settings → API** bölümünden:
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

PostgreSQL connection string gerekmez — sadece Supabase URL + service_role key yeterli.

## Admin kullanımı

1. `/admin/login` adresinden giriş yap
2. **Yeni düşünce** ile kök veya alt dal ekle
3. **Sonraki soru** alanına şemada görünecek soruyu yaz
4. **Dal etiketi** alanına üst düğümden gelen cevabı yaz (örn. Evet, Hayır)
5. **Üst düşünce** seçerek ağaca bağla

## Teknoloji

- Next.js 16 (App Router)
- Supabase (PostgreSQL + REST API)
- React Flow (şema görselleştirme)
- Tailwind CSS
