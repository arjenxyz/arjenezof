export type SiteErrorContent = {
  title: string;
  message: string;
  hint?: string;
};

type SupabaseLikeError = {
  message?: string;
  details?: string;
  hint?: string;
  code?: string;
};

function normalizeErrorText(error: unknown): string {
  if (error instanceof Error) {
    return error.message.toLowerCase();
  }

  if (error && typeof error === "object") {
    const row = error as SupabaseLikeError;
    const parts = [row.message, row.details, row.hint, row.code].filter(
      (part): part is string => typeof part === "string" && part.trim().length > 0,
    );
    if (parts.length > 0) {
      return parts.join(" ").toLowerCase();
    }
  }

  const fallback = String(error).toLowerCase();
  if (fallback === "[object object]") {
    return "";
  }
  return fallback;
}

function getTechnicalHint(error: unknown): string | undefined {
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }

  if (error && typeof error === "object") {
    const row = error as SupabaseLikeError;
    const parts = [row.message, row.details, row.code].filter(
      (part): part is string => typeof part === "string" && part.trim().length > 0,
    );
    if (parts.length > 0) {
      return parts.join(" — ");
    }
  }

  const fallback = String(error).trim();
  if (fallback && fallback !== "[object Object]") {
    return fallback;
  }

  return undefined;
}

export function getDatabaseErrorMessage(error: unknown): SiteErrorContent {
  const msg = normalizeErrorText(error);
  const technical = getTechnicalHint(error);

  if (
    msg.includes("supabase yapılandırması eksik") ||
    msg.includes("next_public_supabase_url") ||
    msg.includes("supabase_service_role_key")
  ) {
    return {
      title: "Supabase yapılandırması eksik",
      message:
        "Site Supabase'e bağlanamıyor. NEXT_PUBLIC_SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY ortam değişkenleri tanımlanmalıdır.",
      hint: "Yanlış anahtar: publishable veya anon key işe yaramaz — Project Settings → API → service_role (secret) gerekir. Vercel'de de aynı iki değişkeni güncelle ve yeniden deploy et.",
    };
  }

  if (
    msg.includes("connect") ||
    msg.includes("econnrefused") ||
    msg.includes("timeout") ||
    msg.includes("fetch failed") ||
    msg.includes("invalid api key") ||
    msg.includes("invalid jwt") ||
    msg.includes("jwt") ||
    msg.includes("unauthorized") ||
    msg.includes("401")
  ) {
    return {
      title: "Supabase'e bağlanılamadı",
      message:
        "Supabase anahtarı veya URL geçersiz görünüyor. Anahtarı döndürdüysen Vercel ortam değişkenlerini de güncelle.",
      hint: technical
        ? `Teknik: ${technical}`
        : "Project Settings → API → Project URL + service_role secret. Publishable/anon key kullanma.",
    };
  }

  if (
    msg.includes("does not exist") ||
    msg.includes("relation") ||
    msg.includes("topic") ||
    msg.includes("quote") ||
    msg.includes("thoughtnode") ||
    msg.includes("familymessage") ||
    msg.includes("familycredential") ||
    msg.includes("42p01")
  ) {
    return {
      title: "Veritabanı tablosu bulunamadı",
      message:
        "Gerekli tablo henüz oluşturulmamış görünüyor (Topic, ThoughtNode, Quote veya aile tabloları).",
      hint: "Yeni kurulum: prisma/supabase-setup.sql. Mevcut veritabanı: supabase/topics-migration.sql, supabase/writings-and-quotes-migration.sql ve supabase/family-migration.sql dosyalarını Supabase SQL Editor'da çalıştır.",
    };
  }

  return {
    title: "Sayfa yüklenemedi",
    message: "Bir sorun oluştu ve sayfa şu an gösterilemiyor. Lütfen biraz sonra tekrar dene.",
    hint: technical
      ? `Teknik: ${technical}`
      : "Sorun devam ederse sayfayı yenile veya ana sayfaya dön.",
  };
}
