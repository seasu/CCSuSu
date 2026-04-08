/** Estimate reading time in minutes (200 wpm for Chinese content) */
export function getReadingTime(content: string): number {
  // Count CJK characters + Latin words
  const cjkChars = (content.match(/[\u4e00-\u9fff\u3040-\u30ff]/g) ?? []).length;
  const latinWords = (content.match(/\b[a-zA-Z]+\b/g) ?? []).length;
  // Assume 400 CJK chars/min and 200 Latin words/min
  const minutes = cjkChars / 400 + latinWords / 200;
  return Math.max(1, Math.ceil(minutes));
}

/**
 * Prefix a path with Astro's BASE_URL so links work under sub-path deployments.
 * BASE_URL is '/CCSuSu/' in production and '/' in dev.
 */
export function siteUrl(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path}`;
}
