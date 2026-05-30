# Bu düşüncelerde ne?

Arjen Esen'in akıl denemelerini şema ve metin olarak paylaştığı kişisel düşünce sitesi.

## Özellikler

- **Şema görünümü:** Tüm düşünce ağacını interaktif haritada gör (salt okunur)
- **Liste görünümü:** Hiyerarşik metin listesi
- **Detay sayfaları:** Her düşüncenin tam metni, etiketleri ve alt dalları
- **Admin paneli:** Sadece sen düşünce ekleyebilir, düzenleyebilir ve silebilirsin
- **Türkçe arayüz**

## Supabase kurulumu

1. [supabase.com](https://supabase.com) üzerinde ücretsiz proje oluştur
2. **Project Settings → Database → Connection string** bölümüne git
3. `.env` dosyasını oluştur:
   ```bash
   cp .env.example .env
   ```
4. İki bağlantı dizesini ekle:
   - **`DATABASE_URL`** — **Transaction** modu, port **6543** (`?pgbouncer=true` ile). Uygulama ve Vercel bunu kullanır.
   - **`DIRECT_URL`** — **Session** modu, port **5432**. `db:push` ve migration için.

Örnek:
```env
DATABASE_URL="postgresql://postgres.xxxxx:ŞİFREN@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxxxx:ŞİFREN@aws-0-eu-central-1.pooler.supabase.com:5432/postgres"
ADMIN_PASSWORD="güçlü-şifre"
ADMIN_SECRET="en-az-32-karakter-rastgele-anahtar"
```

## Yerel kurulum

```bash
npm install
cp .env.example .env
# .env içine Supabase bağlantılarını yaz
npm run db:push
npm run db:seed
npm run dev
```

Site: [http://localhost:3000](http://localhost:3000)  
Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Supabase panelinden **Table Editor** ile `ThoughtNode` tablosunu da görebilirsin.

## Admin kullanımı

1. `/admin/login` adresinden giriş yap
2. **Yeni düşünce** ile kök veya alt dal ekle
3. **Sonraki soru** alanına şemada görünecek soruyu yaz (örn. "Yaratıcı var mıdır?")
4. **Dal etiketi** alanına üst düğümden gelen cevabı yaz (örn. "Evet", "Hayır")
5. **Üst düşünce** seçerek ağaca bağla

## Vercel'e deploy

1. Projeyi GitHub'a bağla ve Vercel'e import et
2. Vercel **Environment Variables** ekle:
   - `DATABASE_URL` — Supabase transaction pooler (6543)
   - `DIRECT_URL` — Supabase session/direct (5432)
   - `ADMIN_PASSWORD` — güçlü şifre
   - `ADMIN_SECRET` — en az 32 karakter rastgele anahtar
3. Deploy öncesi veya sonrası bir kez şemayı yükle:
   ```bash
   npm run db:push
   npm run db:seed
   ```

## Teknoloji

- Next.js 16 (App Router)
- Prisma + Supabase (PostgreSQL)
- React Flow (şema görselleştirme)
- Tailwind CSS
