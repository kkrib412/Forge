// Headless smoke test: load the production web build in a real browser,
// fail on JS console errors, take screenshots of each tab.

const { chromium } = require('/data/data/com.termux/files/home/my-scraper/node_modules/playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/data/data/com.termux/files/usr/lib/chromium/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 }, // iPhone 13 portrait
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  const errors = [];
  const consoleMessages = [];
  page.on('pageerror', (err) => errors.push(`PAGE ERROR: ${err.message}`));
  page.on('console', (msg) => {
    const t = msg.type();
    if (t === 'error' || t === 'warning') {
      consoleMessages.push(`[${t}] ${msg.text()}`);
    }
  });
  page.on('requestfailed', (req) => {
    errors.push(`REQUEST FAILED: ${req.url()} -> ${req.failure()?.errorText}`);
  });

  console.log('→ Navigating to http://localhost:8080/ ...');
  await page.goto('http://localhost:8080/', { waitUntil: 'networkidle', timeout: 30000 });

  // Wait for React to render something
  await page.waitForSelector('div#root > *', { timeout: 15000 });

  const outDir = '/data/data/com.termux/files/home/downloads/ai-forge/smoke-shots';
  require('fs').mkdirSync(outDir, { recursive: true });

  // Snapshot each tab
  const tabs = [
    { name: '01-home', path: '/' },
    { name: '02-services', path: '/services' },
    { name: '03-process', path: '/process' },
    { name: '04-testimonials', path: '/testimonials' },
    { name: '05-contact', path: '/contact' },
  ];

  for (const tab of tabs) {
    if (tab.path !== '/') {
      await page.goto(`http://localhost:8080${tab.path}`, { waitUntil: 'networkidle', timeout: 15000 });
    }
    await page.waitForTimeout(800); // let reanimated settle
    const file = path.join(outDir, `${tab.name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    const title = await page.title();
    const rootChildCount = await page.evaluate(() => document.querySelectorAll('#root > *').length);
    const textSample = (await page.evaluate(() => document.body.innerText)).slice(0, 200).replace(/\n/g, ' ');
    console.log(`  ${tab.name.padEnd(18)}  title="${title}"  rootKids=${rootChildCount}  text="${textSample}..."`);
  }

  // Mobile-tab-bar nav: try clicking the Services tab
  console.log('→ Clicking tab bar (Services) ...');
  await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  try {
    const servicesTab = page.locator('text=Services').first();
    await servicesTab.click({ timeout: 5000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(outDir, '06-clicked-services.png'), fullPage: true });
    console.log('  click ok');
  } catch (e) {
    errors.push(`CLICK FAILED: ${e.message}`);
  }

  await browser.close();

  console.log('\n=== RESULT ===');
  console.log(`pageerror count : ${errors.filter(e => e.startsWith('PAGE ERROR')).length}`);
  console.log(`requestfailed   : ${errors.filter(e => e.startsWith('REQUEST FAILED')).length}`);
  console.log(`console warns   : ${consoleMessages.length}`);
  if (errors.length) {
    console.log('\nERRORS:');
    errors.forEach(e => console.log('  ' + e));
  }
  if (consoleMessages.length) {
    console.log('\nCONSOLE:');
    consoleMessages.slice(0, 20).forEach(m => console.log('  ' + m));
  }
  process.exit(errors.length > 0 ? 1 : 0);
})().catch(e => {
  console.error('FATAL:', e);
  process.exit(2);
});
