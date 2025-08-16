
// Cloudflare Pages Function
export async function onRequest(context) {
  const { request, env } = context;

  // CORS for safety if you later move admin off-domain
  const corsHeaders = {
    "Access-Control-Allow-Origin": env.CORS_ORIGIN || "*",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Secret",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method === "GET") {
    // List all keys in KV and return mapping { id: url }
    let cursor = undefined;
    const result = {};
    do {
      const list = await env.FILES.list({ cursor });
      for (const k of list.keys) {
        const v = await env.FILES.get(k.name);
        if (v != null) result[k.name] = v;
      }
      cursor = list.cursor;
      if (list.list_complete) break;
    } while (true);

    return new Response(JSON.stringify(result, null, 2), {
      headers: { "content-type": "application/json", ...corsHeaders },
    });
  }

  if (request.method === "POST") {
    // Simple admin auth via secret header
    const secret = request.headers.get("x-admin-secret") || "";
    if (secret !== env.ADMIN_SECRET) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json", ...corsHeaders },
      });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { "content-type": "application/json", ...corsHeaders },
      });
    }

    const id = (body.id || "").trim();
    const fileUrl = (body.url || "").trim();
    if (!id || !fileUrl) {
      return new Response(JSON.stringify({ error: "Missing id or url" }), {
        status: 400,
        headers: { "content-type": "application/json", ...corsHeaders },
      });
    }
    try {
      new URL(fileUrl);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid URL" }), {
        status: 400,
        headers: { "content-type": "application/json", ...corsHeaders },
      });
    }

    await env.FILES.put(id, fileUrl);

    return new Response(JSON.stringify({ ok: true, id }), {
      headers: { "content-type": "application/json", ...corsHeaders },
    });
  }

  return new Response("Method Not Allowed", {
    status: 405,
    headers: corsHeaders,
  });
}
