/* Visual verification harness. Not shipped — dev-only.
   Usage: node scripts/shoot.mjs [--mobile] [shot,shot,...]        */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE ?? "http://127.0.0.1:3210";
const OUT = "screenshots";
mkdirSync(OUT, { recursive: true });

const mobile = process.argv.includes("--mobile");
const only = process.argv.find((a) => !a.startsWith("--") && a.includes("="))?.split("=")[1];

// The preinstalled browser build may not match this playwright version,
// so point at it explicitly rather than letting playwright resolve.
const browser = await chromium.launch({
  executablePath:
    process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
const page = await browser.newPage({
  viewport: mobile ? { width: 390, height: 844 } : { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  colorScheme: "dark",
});

const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(`PAGEERROR: ${e.message}`));

const suffix = mobile ? "-m" : "";
const shot = async (label) => {
  await page.screenshot({ path: `${OUT}/${label}${suffix}.png` });
  console.log(`  → ${label}${suffix}.png`);
};

await page.goto(BASE, { waitUntil: "networkidle" });
// Wait for the overture to finish typing and resolve into the title card.
await page.getByRole("button", { name: /begin|pick up/i }).waitFor({ timeout: 20000 });
await page.waitForTimeout(1800);
await shot("00-overture");

const begin = page.getByRole("button", { name: /begin|pick up/i });
if (await begin.count()) {
  await begin.first().click();
  await page.waitForTimeout(1400);
}

const ids = only
  ? only.split(",")
  : ["timeline", "calibration", "noticed", "about", "weekend", "dashboard", "room", "ending"];

for (const [i, id] of ids.entries()) {
  const el = page.locator(`#${id}`);
  if (!(await el.count())) {
    console.log(`  ! #${id} not found`);
    continue;
  }
  await el.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1800);
  await shot(`${String(i + 1).padStart(2, "0")}-${id}`);
}

await browser.close();

if (errors.length) {
  console.log("\nCONSOLE ERRORS:");
  for (const e of new Set(errors)) console.log("  ✗", e);
  process.exitCode = 1;
} else {
  console.log("\nNo console errors.");
}
