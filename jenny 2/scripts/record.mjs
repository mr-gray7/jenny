/* Records a walkthrough of the whole piece to a video file. Dev-only.
   node scripts/record.mjs                                          */
import { chromium } from "playwright";
import { mkdirSync, renameSync, readdirSync } from "node:fs";

const BASE = process.env.BASE ?? "http://127.0.0.1:3216";
const DIR = "screenshots/video";
mkdirSync(DIR, { recursive: true });

const browser = await chromium.launch({
  executablePath:
    process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});

const context = await browser.newContext({
  viewport: { width: 1280, height: 800 },
  colorScheme: "dark",
  recordVideo: { dir: DIR, size: { width: 1280, height: 800 } },
});

const page = await context.newPage();

/** Wheel-scroll in small steps so the capture looks like a person reading. */
async function glide(distance, steps = 26, pause = 34) {
  const step = distance / steps;
  for (let i = 0; i < steps; i += 1) {
    await page.mouse.wheel(0, step);
    await page.waitForTimeout(pause);
  }
}

const hold = (ms) => page.waitForTimeout(ms);

await page.goto(BASE, { waitUntil: "networkidle" });

// 00 — the overture types itself out
await page.getByRole("button", { name: /^Begin/i }).waitFor({ timeout: 20000 });
await hold(2200);
await page.getByRole("button", { name: /^Begin/i }).click();
await hold(1600);

// 01 — the timeline drawing itself
await page.locator("#timeline").scrollIntoViewIfNeeded();
await hold(700);
await glide(1900, 50, 42);
await hold(700);

// 02 — the scan
await page.locator("#scan").scrollIntoViewIfNeeded();
await hold(1100);
await page.getByRole("button", { name: /Run the scan/i }).click();
await hold(6200);

// 03 — turning the cards over, which also opens the room
await page.locator("#noticed").scrollIntoViewIfNeeded();
await hold(900);
const cards = page.locator("#noticed button[aria-expanded]");
for (let i = 0; i < (await cards.count()); i += 1) {
  await cards.nth(i).click();
  await hold(340);
}
await hold(1800);

// 04 — the spec sheet, with a pointer sweep to show the tilt
await page.locator("#about").scrollIntoViewIfNeeded();
await hold(800);
for (const [x, y] of [
  [420, 380],
  [620, 300],
  [820, 440],
  [1040, 360],
]) {
  await page.mouse.move(x, y, { steps: 18 });
  await hold(280);
}
await hold(900);

// 05 — building the weekend
await page.locator("#weekend").scrollIntoViewIfNeeded();
await hold(800);
for (const label of ["Night", "Long drive", "Music"]) {
  await page.getByRole("button", { name: label, exact: true }).click();
  await hold(1500);
}
await page.getByRole("button", { name: /Write it out/i }).click();
await hold(900);
await glide(700, 20, 45);
await hold(2600);

// 06 — the status report, scrolled so the meters fill on entry
await page.locator("#dashboard").scrollIntoViewIfNeeded();
await hold(1300);
await glide(900, 26, 45);
await hold(1600);

// 07 — the star, the room, and Correct My Heart
await page.getByRole("button", { name: /A small star/i }).click();
await hold(2200);
await page.locator("#room").scrollIntoViewIfNeeded();
await hold(1000);
await page.getByRole("button", { name: /On the pace/i }).click();
await hold(2600);
await glide(1400, 32, 45);
await page.getByRole("button", { name: /Correct the word likes/i }).click();
await hold(3200);

// The moon
await page.getByRole("button", { name: /Warm the page towards dawn/i }).click();
await hold(2000);
await page.getByRole("button", { name: /Return to night/i }).click();
await hold(900);

// The last part
await page.locator("#ending").scrollIntoViewIfNeeded();
await hold(900);
await glide(700, 22, 60);
await hold(1600);
await page.getByRole("button", { name: /Let's Keep Writing This Story/i }).click();
await hold(4200);
await glide(500, 16, 50);
await hold(2200);

await context.close();
await browser.close();

// Playwright names the file by internal id; give it something readable.
const file = readdirSync(DIR).find((f) => f.endsWith(".webm"));
if (file) {
  renameSync(`${DIR}/${file}`, `${DIR}/built-slowly-walkthrough.webm`);
  console.log(`→ ${DIR}/built-slowly-walkthrough.webm`);
}
