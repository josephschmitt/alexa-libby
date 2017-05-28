export default function parseDate(dateStr) {
  if (!dateStr) {
    return null;
  }

  const parts = dateStr.split('-');
  const date = new Date(dateStr);

  return {
    year: date.getUTCFullYear(),
    month: parts.length > 1 ? date.getUTCMonth() + 1 : null,
    date: parts.length > 2 ? date.getUTCDate() + 1 : null
  };
}
