import type { FamilyMediaType } from "@/lib/family-media";

type Props = {
  mediaUrl: string;
  mediaType: FamilyMediaType | "";
  className?: string;
};

export function FamilyMessageMedia({ mediaUrl, mediaType, className = "" }: Props) {
  if (!mediaUrl || !mediaType) return null;

  const wrapperClass = `overflow-hidden rounded-xl border border-stone-200 bg-stone-50 ${className}`;

  if (mediaType === "image") {
    return (
      <div className={wrapperClass}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mediaUrl} alt="" className="max-h-[28rem] w-full object-contain" />
      </div>
    );
  }

  if (mediaType === "audio") {
    return (
      <div className={`${wrapperClass} p-4`}>
        <audio controls src={mediaUrl} className="w-full" preload="metadata" />
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <video controls src={mediaUrl} className="max-h-[28rem] w-full" preload="metadata" />
    </div>
  );
}
