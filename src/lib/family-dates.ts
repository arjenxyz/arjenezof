function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function capitalizeTurkish(text: string) {
  if (!text) return text;
  return text.charAt(0).toLocaleUpperCase("tr-TR") + text.slice(1);
}

export type FamilyMessageWhen = {
  relative: string | null;
  full: string;
  time: string | null;
  wasUpdated: boolean;
  primary: string;
  secondary: string;
};

export function formatFamilyMessageWhen(
  date: Date,
  options?: { createdAt?: Date; reference?: Date },
): FamilyMessageWhen {
  const reference = options?.reference ?? new Date();
  const createdAt = options?.createdAt;
  const wasUpdated =
    !!createdAt &&
    Math.abs(date.getTime() - createdAt.getTime()) > 60_000;

  const full = capitalizeTurkish(
    new Intl.DateTimeFormat("tr-TR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date),
  );

  const time = new Intl.DateTimeFormat("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  const hasMeaningfulTime =
    date.getHours() !== 0 || date.getMinutes() !== 0 || date.getSeconds() !== 0;

  const relative = formatRelativeTurkish(date, reference);
  const primary = relative ?? full;
  const secondaryParts = [relative ? full : null, hasMeaningfulTime ? time : null].filter(Boolean);
  const secondary = secondaryParts.join(" · ");

  return {
    relative,
    full,
    time: hasMeaningfulTime ? time : null,
    wasUpdated,
    primary,
    secondary,
  };
}

function formatRelativeTurkish(date: Date, reference: Date): string | null {
  const dateDay = startOfDay(date).getTime();
  const refDay = startOfDay(reference).getTime();
  const dayDiff = Math.round((refDay - dateDay) / 86_400_000);

  if (dayDiff === 0) return "Bugün";
  if (dayDiff === 1) return "Dün";
  if (dayDiff > 1 && dayDiff < 7) return `${dayDiff} gün önce`;

  const weekDiff = Math.floor(dayDiff / 7);
  if (weekDiff >= 1 && weekDiff < 5) return weekDiff === 1 ? "1 hafta önce" : `${weekDiff} hafta önce`;

  const monthDiff =
    (reference.getFullYear() - date.getFullYear()) * 12 +
    (reference.getMonth() - date.getMonth());
  if (monthDiff >= 1 && monthDiff < 12) {
    return monthDiff === 1 ? "1 ay önce" : `${monthDiff} ay önce`;
  }

  const yearDiff = reference.getFullYear() - date.getFullYear();
  if (yearDiff >= 1 && yearDiff < 3) {
    return yearDiff === 1 ? "1 yıl önce" : `${yearDiff} yıl önce`;
  }

  return null;
}
