export async function GET() {
  const res = await fetch("https://api.bithumb.com/v1/market/all", {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), {
      status: 500,
    });
  }

  const data = await res.json();
  return new Response(JSON.stringify(data), { status: 200 });
}
