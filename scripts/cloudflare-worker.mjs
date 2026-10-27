export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    if (response.status !== 404 || !["GET", "HEAD"].includes(request.method)) {
      return response;
    }

    const accept = request.headers.get("Accept");
    if (accept && !accept.includes("text/html") && !accept.includes("*/*")) {
      return response;
    }

    const url = new URL(request.url);
    let pathname;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      return response;
    }

    const [, slug, section] = pathname.split("/");
    const lastSegment = pathname.replace(/\/+$/, "").split("/").pop();

    // Only extensionless slide routes may fall back to a presentation entry.
    if (!slug || section === "assets" || lastSegment.includes(".")) {
      return response;
    }

    url.pathname = `/${encodeURIComponent(slug)}/`;
    const entry = await env.ASSETS.fetch(new Request(url, request));
    return entry.status === 404 ? response : entry;
  },
};
