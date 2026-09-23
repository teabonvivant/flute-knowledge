export function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}

export function truncate(value: string, length = 120) {
  if (!value) return "";
  return value.length > length ? `${value.slice(0, length - 1)}…` : value;
}

export function splitValues(value = "") {
  return value
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
}
