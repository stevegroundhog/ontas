/** Build plain-text share / export cards for desks. */

export function downloadTextFile(filename: string, body: string) {
  const blob = new Blob([body], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function buildDeepLink(params: {
  desk?: string;
  nation?: string;
  compare?: string;
  conflict?: string;
}): string {
  if (typeof window === "undefined") return "/";
  const u = new URL(window.location.href);
  u.search = "";
  if (params.desk) u.searchParams.set("desk", params.desk);
  if (params.nation) u.searchParams.set("nation", params.nation);
  if (params.compare) u.searchParams.set("compare", params.compare);
  if (params.conflict) u.searchParams.set("conflict", params.conflict);
  u.searchParams.set("asof", new Date().toISOString().slice(0, 16) + "Z");
  return u.toString();
}
