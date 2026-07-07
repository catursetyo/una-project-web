export function toYouTubeEmbedUrl(url?: string) {
  if (!url) return undefined;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    const id =
      host === "youtu.be"
        ? parsed.pathname.slice(1)
        : host.endsWith("youtube.com")
          ? parsed.searchParams.get("v") || parsed.pathname.split("/embed/")[1]
          : "";

    return id ? `https://www.youtube.com/embed/${id.split(/[/?#]/)[0]}` : undefined;
  } catch {
    return undefined;
  }
}
