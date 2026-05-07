import http from 'http';
import fs from 'fs';
import path from 'path';
import puppeteer from 'puppeteer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '../public');

// Read the pure SPA index.html into memory BEFORE we overwrite it
// This serves as the clean fallback for all routes during prerendering
const spaIndexHtml = fs.readFileSync(path.join(publicDir, 'index.html'), 'utf-8');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4'
};

const server = http.createServer((req, res) => {
  let reqPath = req.url.split('?')[0]; // Remove query string
  let filePath = path.join(publicDir, reqPath === '/' ? 'index.html' : reqPath);
  
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    // SPA fallback: Serve the pure SPA HTML from memory!
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(spaIndexHtml, 'utf-8');
    return;
  }

  const extname = path.extname(filePath);
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end(`Server Error: ${err.code}`);
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(0, async () => {
  const port = server.address().port;
  console.log(`Static server started on port ${port}`);

  try {
    const executablePath = puppeteer.executablePath();
    console.log(`Using Chromium from: ${executablePath}`);
    
    const browser = await puppeteer.launch({
      executablePath,
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const routes = ['/', '/for-it-admins'];

    for (const route of routes) {
      console.log(`Prerendering ${route}...`);
      const page = await browser.newPage();
      
      // Block third-party scripts to avoid side effects and speed up rendering
      await page.setRequestInterception(true);
      page.on('request', (req) => {
        const url = req.url();
        if (url.includes('clarity.ms') || url.includes('google-analytics.com') || url.includes('googletagmanager.com')) {
          req.abort();
        } else {
          req.continue();
        }
      });

      // Navigate and wait for network to settle
      await page.goto(`http://localhost:${port}${route}`, { waitUntil: 'networkidle0' });
      
      // Ensure React has actually mounted and rendered
      await page.waitForSelector('#root > div', { timeout: 10000 });
      
      let html = await page.content();
      
      let outPath;
      if (route === '/') {
        outPath = path.join(publicDir, 'index.html');
      } else {
        const routeDir = path.join(publicDir, route);
        if (!fs.existsSync(routeDir)) {
          fs.mkdirSync(routeDir, { recursive: true });
        }
        outPath = path.join(routeDir, 'index.html');
      }

      fs.writeFileSync(outPath, html);
      console.log(`Saved ${outPath}`);
      await page.close();
    }

    await browser.close();
    server.close();
    console.log('Prerendering completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Prerendering failed:', error);
    server.close();
    process.exit(1);
  }
});
