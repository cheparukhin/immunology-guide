// Minimal static file server for QA tools. Each tool starts its own on a free
// port (port 0), so any number of agents can run screenshots concurrently.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.map': 'application/json',
};

/** Start a server rooted at `root`. Resolves to { url, port, close() }. */
export function startServer(root) {
  const base = path.resolve(root);
  const server = http.createServer((req, res) => {
    let rel;
    try { rel = decodeURIComponent(new URL(req.url, 'http://x').pathname); } catch { res.writeHead(400).end(); return; }
    let file = path.join(base, rel);
    if (!file.startsWith(base)) { res.writeHead(403).end(); return; }
    try {
      if (fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    } catch { /* fallthrough to 404 */ }
    fs.readFile(file, (err, buf) => {
      if (err) { res.writeHead(404, { 'content-type': 'text/plain' }).end('Not found'); return; }
      res.writeHead(200, {
        'content-type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
        'cache-control': 'no-store',
      });
      res.end(buf);
    });
  });
  return new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ port, url: `http://127.0.0.1:${port}/`, close: () => new Promise((r) => { server.closeAllConnections?.(); server.close(() => r()); }) });
    });
  });
}

export const VIEWPORTS = {
  desktop: { width: 1440, height: 900 },
  laptop: { width: 1280, height: 800 },
  tablet: { width: 820, height: 1180 },
  mobile: { width: 390, height: 844, isMobile: true, hasTouch: true },
  small: { width: 360, height: 740, isMobile: true, hasTouch: true },
};

export function parseViewport(v) {
  if (VIEWPORTS[v]) return { name: v, ...VIEWPORTS[v] };
  const m = String(v).match(/^(\d+)x(\d+)$/);
  if (m) {
    const width = Number(m[1]);
    return { name: v, width, height: Number(m[2]), isMobile: width < 600, hasTouch: width < 600 };
  }
  throw new Error(`Unknown viewport "${v}" (use desktop|laptop|tablet|mobile|small|WxH)`);
}

/**
 * Attach listeners that collect console errors/warnings, page errors and
 * failed requests. Returns the live report object.
 */
export function collectDiagnostics(page, origin) {
  const report = { consoleErrors: [], consoleWarnings: [], pageErrors: [], failedRequests: [] };
  page.on('console', (msg) => {
    const t = msg.type();
    const text = msg.text();
    const loc = msg.location();
    const where = loc?.url ? ` (${loc.url.replace(origin, '')}:${loc.lineNumber})` : '';
    if (t === 'error') report.consoleErrors.push(text + where);
    else if (t === 'warning') report.consoleWarnings.push(text + where);
  });
  page.on('pageerror', (err) => report.pageErrors.push(String(err.stack || err.message || err).split('\n').slice(0, 4).join('\n')));
  page.on('requestfailed', (req) => {
    const f = req.failure()?.errorText || 'failed';
    if (f.includes('ERR_ABORTED')) return; // navigation/teardown noise
    report.failedRequests.push(`${req.url().replace(origin, '')} (${f})`);
  });
  page.on('response', (res) => {
    if (res.status() >= 400) report.failedRequests.push(`${res.url().replace(origin, '')} (HTTP ${res.status()})`);
  });
  return report;
}

/** Overflow probe, run in the page: is the document wider than the viewport, and who sticks out? */
export const overflowProbe = () => {
  const vw = document.documentElement.clientWidth;
  const sw = document.documentElement.scrollWidth;
  const offenders = [];
  if (sw > vw + 1) {
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width && (r.right > vw + 1 || r.left < -1)) {
        const style = getComputedStyle(el);
        if (style.position === 'fixed' || el.closest('[hidden], dialog:not([open])')) continue;
        let sel = el.tagName.toLowerCase();
        if (el.id) sel += `#${el.id}`;
        if (el.classList.length) sel += '.' + [...el.classList].slice(0, 3).join('.');
        offenders.push(`${sel} [${Math.round(r.left)}→${Math.round(r.right)}]`);
        if (offenders.length >= 8) break;
      }
    }
  }
  return { detected: sw > vw + 1, documentWidth: sw, viewportWidth: vw, offenders };
};

/** Figure status probe (relies on site.js exposing window.__so). */
export const figureProbe = () => {
  const list = window.__so?.figures?.() || [];
  const els = [...document.querySelectorAll('figure.fig[data-figure]')];
  return {
    total: els.length,
    mounted: list.filter((f) => f.status === 'mounted').map((f) => f.id),
    failed: list.filter((f) => f.status === 'failed').map((f) => ({ id: f.id, error: (f.error || '').split('\n')[0] })),
    pending: list.filter((f) => f.status === 'pending' || f.status === 'loading').map((f) => f.id),
  };
};
