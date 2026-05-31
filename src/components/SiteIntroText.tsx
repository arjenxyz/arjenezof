export function SiteIntroText({ className = "" }: { className?: string }) {
  return (
    <div className={`space-y-4 text-sm leading-relaxed text-stone-700 sm:text-base ${className}`}>
      <p>
        <strong>Bu düşüncelerde ne?</strong>, Arjen&apos;in kendi kendine sorduğu soruların ve akıl
        denemelerinin paylaşıldığı kişisel bir yazı alanıdır. Buradaki metinler kesin hükümler
        değildir; zamanla değişebilir, yanlış olabilir, eksik kalabilir.
      </p>
      <p className="text-stone-600">
        Konulara, etiketlere ve metinler arası bağlantılara göre gezinebilirsin. Bir metnin
        devamını okuyabilir veya ilgi alanına göre benzer yazılara geçebilirsin.
      </p>
    </div>
  );
}
