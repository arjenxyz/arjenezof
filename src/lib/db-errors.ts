export type SiteErrorContent = {
  title: string;
  message: string;
  hint?: string;
};

export function getDatabaseErrorMessage(error: unknown): SiteErrorContent {
  const msg = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  if (msg.includes("database_url") || msg.includes("ortam değişkeni tanımlı değil")) {
    return {
      title: "Veritabanı bağlantısı eksik",
      message:
        "Site veritabanına bağlanamıyor. DATABASE_URL ve DIRECT_URL ortam değişkenleri tanımlanmalıdır.",
      hint: "Vercel kullanıyorsan: Settings → Environment Variables bölümünden Supabase bağlantı dizelerini ekle ve yeniden deploy et.",
    };
  }

  if (
    msg.includes("connect") ||
    msg.includes("econnrefused") ||
    msg.includes("timeout") ||
    msg.includes("authentication failed") ||
    msg.includes("password")
  ) {
    return {
      title: "Veritabanına bağlanılamadı",
      message:
        "Supabase veritabanına şu an ulaşılamıyor. Bağlantı bilgilerini, şifreyi ve ThoughtNode tablosunun oluşturulduğunu kontrol et.",
      hint: "Supabase panelinde SQL Editor'dan prisma/supabase-setup.sql dosyasını çalıştırdığından emin ol.",
    };
  }

  if (msg.includes("does not exist") || msg.includes("relation") || msg.includes("thoughtnode")) {
    return {
      title: "Veritabanı tablosu bulunamadı",
      message: "ThoughtNode tablosu henüz oluşturulmamış görünüyor.",
      hint: "Supabase SQL Editor'a prisma/supabase-setup.sql içeriğini yapıştırıp çalıştır.",
    };
  }

  return {
    title: "Sayfa yüklenemedi",
    message: "Bir sorun oluştu ve sayfa şu an gösterilemiyor. Lütfen biraz sonra tekrar dene.",
    hint: "Sorun devam ederse sayfayı yenile veya ana sayfaya dön.",
  };
}
