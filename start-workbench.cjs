const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');

const root = path.join(__dirname, 'workbench', 'dist');
const host = '127.0.0.1';
const port = 8765;
const url = `http://${host}:${port}`;
const assets = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/styles.css', ['styles.css', 'text/css; charset=utf-8']],
  ['/core.js', ['core.js', 'text/javascript; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
]);

const server = http.createServer((req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    return res.end();
  }
  const asset = assets.get(req.url.split('?')[0]);
  if (!asset) {
    res.writeHead(404);
    return res.end('Not found');
  }
  fs.readFile(path.join(root, asset[0]), (error, body) => {
    if (error) {
      res.writeHead(500);
      return res.end('Unable to read workbench files');
    }
    res.writeHead(200, { 'Content-Type': asset[1], 'Cache-Control': 'no-store' });
    res.end(req.method === 'HEAD' ? undefined : body);
  });
});

server.on('error', error => {
  console.error(error.code === 'EADDRINUSE'
    ? `Port ${port} is already in use. Close the previous server and try again.`
    : error.message);
  process.exitCode = 1;
});
server.listen(port, host, () => {
  console.log(`MathorCup workbench: ${url}\nPress Ctrl+C to stop.`);
  if (process.argv.includes('--open') && process.platform === 'win32') {
    const browser = spawn('powershell.exe', [
      '-NoProfile', '-NonInteractive', '-WindowStyle', 'Hidden',
      '-Command', `Start-Process '${url}'`,
    ], { windowsHide: true, stdio: 'ignore' });
    browser.on('error', () => console.log(`Open ${url} in your browser.`));
  }
});
