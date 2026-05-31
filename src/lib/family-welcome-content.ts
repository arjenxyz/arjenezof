export const WIFE_WELCOME = {
  eyebrow: "Arjen · Aile paneli",
  headline: "Hoş geldin.",
  lead: "Bu alan, aile üyelerine özel hazırlanmış bir bölümdür. Herkese açık siteden bağımsızdır; yalnızca şifreyle giriş yapan aile üyeleri erişebilir.",
  letter: {
    title: "Bu alan neden var?",
    paragraphs: [
      "Zaman içinde biriken düşünceleri, notları ve aileye yönelik yazıları tek bir yerde toplamak için bu paneli oluşturdum. Amaç; sana, çocuklarımıza ve torunlarımıza yazılan metinlerin düzenli, erişilebilir ve güvenli biçimde saklanmasıdır.",
      "Her aile üyesi kendi şifresiyle giriş yapar. Çocuklar yalnızca kendilerine yazılan bölümü, torunlar kendilerine yazılan bölümü görür. Sen tüm bölümlere erişebilir ve çocuklar ile torunlar için yazı ekleyebilirsin.",
      "Metinler istendiğinde okunabilir, istendiğinde güncellenebilir. Panel zamanla genişleyecek bir arşiv gibi çalışır; amacı günlük kullanım değil, uzun vadeli kayıt tutmaktır.",
    ],
  },
  goals: [
    {
      title: "Sana",
      description: "Yalnızca senin görebileceğin, sana yönelik yazılar.",
    },
    {
      title: "Çocuklarımıza",
      description: "Çocukların kendi panelinde okuyabileceği metinler. Sen de bu bölüme yazı ekleyebilirsin.",
    },
    {
      title: "Torunlarımıza",
      description: "Torunların kendi panelinde okuyabileceği metinler. Sen de bu bölüme yazı ekleyebilirsin.",
    },
  ],
  goalsIntro: "Panel üç ana bölümden oluşur:",
  closing:
    "Okuma ve yazma işlemlerine aşağıdaki bağlantılardan veya sağ üstteki menüden geçebilirsin.",
} as const;

export const FAMILY_WELCOME_OTHERS: Record<
  "children" | "grandchildren",
  { headline: string; lead: string; note: string }
> = {
  children: {
    headline: "Hoş geldin.",
    lead: "Bu bölümde size, kardeşlerinize ve ailenize yazılmış metinler listelenir. Herkes kendi şifresiyle yalnızca kendisine açık içeriği görür.",
    note: "Yazılara sağ üstteki menüden ulaşabilirsin.",
  },
  grandchildren: {
    headline: "Hoş geldin.",
    lead: "Bu bölümde sana yazılmış metinler listelenir. Giriş yalnızca sana verilen şifreyle yapılır.",
    note: "Yazılara sağ üstteki menüden ulaşabilirsin.",
  },
};
