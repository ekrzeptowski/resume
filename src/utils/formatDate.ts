export function formatDate(dateString: string | number | Date, locale: Intl.LocalesArgument) {
  return new Date(dateString).toLocaleDateString(locale, {
    year: "numeric",
    month: "2-digit",
  });
}
