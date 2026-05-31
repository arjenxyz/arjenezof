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
    msg.includes("supabase_service_role_key") ||
    msg.includes("supabase_secret_key")
  ) {
    return {
      title: "Supabase yapılandırması eksik",
      message:
        "Site Supabase'e bağlanamıyor. NEXT_PUBLIC_SUPABASE_URL ve sunucu anahtarı (SUPABASE_SECRET_KEY) tanımlanmalıdır.",
      hint: "Publishable key (sb_publishable_...) yalnızca tarayıcı içindir. Sunucu için Supabase → Settings → API Keys → Secret key (sb_secret_...) kullan.",
    };
  }

  if (msg.includes("legacy api keys are disabled")) {
    return {
      title: "Eski Supabase anahtarları kapatılmış",
      message:
        "Projende legacy JWT anahtarları (eyJ... service_role) devre dışı. Yeni secret key (sb_secret_...) kullanmalısın.",
      hint: "Supabase → Settings → API Keys → Secret keys bölümünden sb_secret_... anahtarını kopyala; SUPABASE_SECRET_KEY olarak .env ve Vercel'e ekle, sonra redeploy et.",
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
        : "Project Settings → API Keys → Project URL + Secret key (sb_secret_...). Publishable key sunucuda kullanılmaz.",
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
    msg.includes("authorrole") ||
    msg.includes("42p01")
  ) {
    return {
      title: "Veritabanı tablosu bulunamadı",
      message:
        "Gerekli tablo henüz oluşturulmamış görünüyor (Topic, ThoughtNode, Quote veya aile tabloları).",
      hint: "Yeni kurulum: prisma/supabase-setup.sql. Mevcut veritabanı: supabase/topics-migration.sql, supabase/writings-and-quotes-migration.sql, supabase/family-migration.sql ve supabase/family-author-migration.sql dosyalarını Supabase SQL Editor'da çalıştır.",
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
