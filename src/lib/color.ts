export function addAlpha(color: string, opacity?: number): string {
    // coerce values so it is between 0 and 1.
    const _opacity = Math.round(Math.min(Math.max(opacity ?? 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
}

export function isColorDark(hex: string, alpha = 1) {
  // Remove alpha if present
  hex = hex.replace(/^#/, "");
  if (hex.length === 3) {
    hex = hex.split("").map(x => x + x).join("");
  }
  const num = parseInt(hex.slice(0, 6), 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  // Use luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) * alpha + 255 * (1 - alpha);
  return luminance < 140;
}