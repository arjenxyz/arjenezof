export type SiteErrorContent = {
  title: string;
  message: string;
  hint?: string;
};

export function getDatabaseErrorMessage(error: unknown): SiteErrorContent {
  const msg = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();

  if (
    msg.includes("supabase yapılandırması eksik") ||
    msg.includes("next_public_supabase_url") ||
    msg.includes("supabase_service_role_key")
  ) {
    return {
      title: "Supabase yapılandırması eksik",
      message:
        "Site Supabase'e bağlanamıyor. NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY ortam değişkenleri tanımlanmalıdır.",
      hint: "Vercel: Settings → Environment Variables. URL: https://....supabase.co — Anahtar: Project Settings → API → service_role (gizli).",
    };
  }

  if (
    msg.includes("connect") ||
    msg.includes("econnrefused") ||
    msg.includes("timeout") ||
    msg.includes("fetch failed") ||
    msg.includes("invalid api key")
  ) {
    return {
      title: "Supabase'e bağlanılamadı",
      message: "Supabase'e şu an ulaşılamıyor. URL ve service_role anahtarını kontrol et.",
      hint: "Project Settings → API bölümünden URL ve service_role key'i kopyala.",
    };
  }

  if (
    msg.includes("does not exist") ||
    msg.includes("relation") ||
    msg.includes("topic") ||
    msg.includes("quote") ||
    msg.includes("thoughtnode") ||
    msg.includes("42p01")
  ) {
    return {
      title: "Veritabanı tablosu bulunamadı",
      message: "Topic, ThoughtNode veya Quote tablosu henüz oluşturulmamış görünüyor.",
      hint: "Yeni kurulum: prisma/supabase-setup.sql. Mevcut veritabanı: supabase/topics-migration.sql ve supabase/writings-and-quotes-migration.sql dosyalarını Supabase SQL Editor'da çalıştır.",
    };
  }

  return {
    title: "Sayfa yüklenemedi",
    message: "Bir sorun oluştu ve sayfa şu an gösterilemiyor. Lütfen biraz sonra tekrar dene.",
    hint: "Sorun devam ederse sayfayı yenile veya ana sayfaya dön.",
  };
}
