export async function onRequestGet(context) {
  const { env, next } = context;

  // Try to fetch the feed.xml from the static assets
  const response = await next();

  // If feed.xml exists, serve it with correct content-type
  if (response.status === 200) {
    const xml = await response.text();
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, must-revalidate',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  // Fallback: generate basic RSS if not found
  const siteUrl = 'https://mynomadlawyer.com';
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>My Nomad Lawyer</title>
    <link>${siteUrl}/</link>
    <description>Professional legal services for expats, nomads & investors in Spain. EU-certified lawyer. Personalized support in English, Spanish & Italian.</description>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed/" rel="self" type="application/rss+xml" />
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, must-revalidate',
      'Access-Control-Allow-Origin': '*',
    },
  });
}