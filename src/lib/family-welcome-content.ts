export const WIFE_WELCOME = {
  eyebrow: "Arjen · Aileye özel",
  headline: "Merhaba.",
  lead: "Bu alanı senin için, bizim ailemiz için yaptım. Herkese açık siteden ayrı; yalnızca ailemizin görebileceği, saklayabileceği bir köşe.",
  letter: {
    title: "Neden burayı oluşturdum?",
    paragraphs: [
      "Hayatın içinde söylemek isteyip zamanı gelmeyen, ya da kelimelerin yetmediği anlar oluyor. Bazen bir cümle, yıllar sonra bile insana iyi geliyor. Bu yüzden sana, çocuklarımıza ve torunlarımıza yazabileceğim — ve senin de onlara yazabileceğin — sessiz bir oda istedim.",
      "Burada acele yok. Düşünceler birikebilir. Okumak istediğinde okursun; yazmak istediğinde yazarsın. Herkes kendi şifresiyle girer; çocuklar yalnızca kendilerine yazılanları, torunlar kendilerine yazılanları görür. Sen hepsini görebilirsin.",
      "Bunu bir proje gibi değil, bir ev gibi düşün: içinde sen varsın, ben varım, çocuklarımız ve torunlarımız. Zamanla dolacak; belki yıllar sonra bir torun burada bir cümle okuyacak ve bizi bir anlığına yanında hissedecek.",
    ],
  },
  goals: [
    {
      title: "Sana",
      description: "Sana özel yazılar — yalnızca senin okuyabileceğin düşünceler, notlar, belki bazen söyleyemediklerim.",
    },
    {
      title: "Çocuklarımıza",
      description: "Onlara bırakmak istediğimiz sözler; sen de kendi sesinle onlara yazabilirsin.",
    },
    {
      title: "Torunlarımıza",
      description: "Henüz tanışmadığımız, ama kalbimizde yer edinen küçük insanlara uzanan bir köprü.",
    },
  ],
  closing:
    "Bu alan dün de vardı, yarın da olacak. Şimdi sen geldin — hoş geldin. İstersen önce benim sana yazdıklarıma bak; istersen doğrudan çocuklara veya torunlara bir satır bırak.",
} as const;

export const FAMILY_WELCOME_OTHERS: Record<
  "children" | "grandchildren",
  { headline: string; lead: string; note: string }
> = {
  children: {
    headline: "Merhaba.",
    lead: "Babaannene, büyükbabandan ve annenden size yazılan metinler burada. Kardeşlerinle birlikte okuyabilirsin.",
    note: "Sağ üstteki menüden yazılara ulaşabilirsin.",
  },
  grandchildren: {
    headline: "Merhaba.",
    lead: "Büyükannenden ve büyükbabandan sana yazılan metinler burada.",
    note: "Sağ üstteki menüden yazılara ulaşabilirsin.",
  },
};
