export async function onRequestGet({ request, env }) {
  const { searchParams } = new URL(request.url);
  const id = (searchParams.get("id") || "").trim();
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const url = await env.FILES.get(id);
  if (!url) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "content-type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ id, url }), {
    headers: { "content-type": "application/json" },
  });
}

