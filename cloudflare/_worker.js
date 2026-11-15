
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    let file = null;

    // Short form: /filename.pdf
    if (/^\/[^/]+\.pdf$/i.test(url.pathname)) {
      file = url.pathname.slice(1);
    }

    // Backward-compatible form:
    // /docs/credentials/<type>/<filename>.pdf
    else if (url.pathname.startsWith('/docs/credentials/')) {
      const parts = url.pathname.split('/').filter(Boolean);

      const type = parts[2];
      const filename = parts[3];

      if (
        parts.length !== 4 ||
        !['certifications', 'certificates', 'courses'].includes(type) ||
        !filename
      ) {
        return new Response('Not found', { status: 404 });
      }

      file = filename;
    }

    // Proxy PDF from GitHub Releases
    if (file !== null) {
      if (!/^[a-z0-9][a-z0-9-]*\.pdf$/i.test(file)) {
        return new Response('Not found', { status: 404 });
      }

      if (!['GET', 'HEAD'].includes(request.method)) {
        return new Response('Method not allowed', {
          status: 405,
          headers: { Allow: 'GET, HEAD' },
        });
      }

      const gh = `https://github.com/ixchelone/resume/releases/download/credentials/${encodeURIComponent(file)}`;

      const upstream = await fetch(gh, {
        method: request.method,
        headers: { 'User-Agent': 'cf-proxy' },
      });

      if (!upstream.ok) {
        return new Response(`Upstream ${upstream.status}`, {
          status: upstream.status,
        });
      }

      const headers = new Headers(upstream.headers);

      headers.set('Content-Disposition', `inline; filename="${file}"`);
      headers.set('Content-Type', 'application/pdf');
      headers.set('Cache-Control', 'public, max-age=3600');

      return new Response(upstream.body, {
        status: upstream.status,
        headers,
      });
    }

    // All other requests go to Hugo static assets
    return env.ASSETS.fetch(request);
  },
};
