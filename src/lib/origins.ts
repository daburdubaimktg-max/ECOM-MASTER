/**
 * Matches a request's origin host against ALLOWED_ORIGINS entries, the same way Next.js matches
 * `serverActions.allowedOrigins`: `*` stands for exactly one label of the host name.
 */
export function originAllowedByList(originHost: string, list: string | undefined): boolean {
  const entries = (list ?? '')
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
  const labels = originHost.toLowerCase().split('.');
  return entries.some((entry) => {
    const parts = entry.split('.');
    return parts.length === labels.length && parts.every((part, i) => part === '*' || part === labels[i]);
  });
}
