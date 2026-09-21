export function formatDate(date, options = {}) {
  if (!date) return "-";

  const defaultOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  };

  return new Intl.DateTimeFormat("id-ID", {
    ...defaultOptions,
    ...options,
  }).format(new Date(`${date}T00:00:00`));
}

export function formatDateWithDay(date) {
  return formatDate(date, {
    weekday: "long",
  });
}
