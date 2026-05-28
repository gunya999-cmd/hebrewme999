export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/health" || url.pathname === "/") {
      return Response.json({
        ok: true,
        service: "hebrewme-worker",
        source: "github-actions",
        timestamp: new Date().toISOString(),
      });
    }

    return new Response("Not found", { status: 404 });
  },
};
