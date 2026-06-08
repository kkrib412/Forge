// Tiny SPA-fallback static server. Serves files from ROOT.
// For any GET that doesn't match a real file and has no dot in the last
// segment, returns index.html (expo-router / SPA routing).
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(process.argv[2] || './dist');
const PORT = parseInt(process.argv[3] || '8080', 10);

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'text/javascript; charset=utf-8',
  '.mjs':  'text/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.ttf':  'font/ttf',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.map':  'application/json; charset=utf-8',
  '.txt':  'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

function serveFile(file, res) {
  const ext = path.extname(file).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}

const server = http.createServer((req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405).end('Method Not Allowed');
    return;
  }
  const url = req.url.split('?')[0];
  // Strip leading slash so path.join treats url as relative
  const rel = url.replace(/^\/+/, '');
  const file = path.join(ROOT, rel);

  fs.stat(file, (err, stat) => {
    if (!err && stat.isFile()) {
      serveFile(file, res);
      return;
    }
    if (!err && stat.isDirectory()) {
      const idx = path.join(file, 'index.html');
      if (fs.existsSync(idx)) { serveFile(idx, res); return; }
    }
    // SPA fallback: any non-asset path -> index.html
    const last = url.split('/').pop() || '';
    if (!last.includes('.')) {
      const idx = path.join(ROOT, 'index.html');
      if (fs.existsSync(idx)) { serveFile(idx, res); return; }
    }
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not Found: ' + url);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`SPA server: http://localhost:${PORT}/  (root: ${ROOT})`);
});
