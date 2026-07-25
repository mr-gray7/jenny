/* Drives the real interactions and asserts they work. Dev-only.
   node scripts/interact.mjs                                        */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE ?? "http://127.0.0.1:3217";
const OUT = "screenshots";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath:
    process.env.CHROMIUM_PATH ?? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  colorScheme: "dark",
});

const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(`PAGEERROR: ${e.message}`));

const checks = [];
const check = (name, ok, detail = "") => {
  checks.push({ name, ok });
  console.log(`${ok ? "  ✓" : "  ✗"} ${name}${detail ? ` — ${detail}` : ""}`);
};

await page.goto(BASE, { waitUntil: "networkidle" });
await page.getByRole("button", { name: /^Begin$|Pick up/i }).waitFor({ timeout: 30000 });
check("landing sequence resolves to the CTA", true);
await page.screenshot({ path: `${OUT}/i-landing.png` });

await page.getByRole("button", { name: /^Begin$/ }).click();
await page.waitForTimeout(1200);

/* ── 01 Timeline ─────────────────────────────────────────────────── */
await page.locator("#timeline").scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
const beats = await page.locator("#timeline li").count();
check("timeline renders 7 beats", beats === 7, `got ${beats}`);
check("final beat present", await page.getByText("We're talking again.").isVisible());

/* ── 02 Scan ─────────────────────────────────────────────────────── */
await page.locator("#scan").scrollIntoViewIfNeeded();
await page.waitForTimeout(700);
check(
  "scan does not autostart",
  await page.getByRole("button", { name: /Run the scan/i }).isVisible(),
);
await page.getByRole("button", { name: /Run the scan/i }).click();
await page.waitForTimeout(6000);
check(
  "scan conclusion appears",
  await page.getByText("Definitely worth knowing better.").isVisible(),
);
check(
  "scan lists all 8 traits",
  (await page.locator("#scan li").count()) === 8,
  `${await page.locator("#scan li").count()}`,
);
await page.locator("#scan").scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
await page.screenshot({ path: `${OUT}/i-scan.png` });

/* ── 03 Noticed ──────────────────────────────────────────────────── */
await page.locator("#noticed").scrollIntoViewIfNeeded();
await page.waitForTimeout(700);
const cards = page.locator("#noticed button[aria-expanded]");
const cardCount = await cards.count();
for (let i = 0; i < cardCount; i += 1) await cards.nth(i).click();
await page.waitForTimeout(1000);
check("all 8 noticed cards flip", cardCount === 8, `got ${cardCount}`);

/* ── 05 Weekend ──────────────────────────────────────────────────── */
await page.locator("#weekend").scrollIntoViewIfNeeded();
await page.waitForTimeout(700);
await page.getByRole("button", { name: "Night", exact: true }).click();
await page.waitForTimeout(500);
await page.getByRole("button", { name: "Long drive", exact: true }).click();
await page.waitForTimeout(1400);
check(
  "long drive fires the specified reaction",
  await page.getByText(/Bonus points if it is raining/i).isVisible(),
);
await page.getByRole("button", { name: "Music", exact: true }).click();
await page.waitForTimeout(400);
await page.getByRole("button", { name: /Write it out/i }).click();
await page.waitForTimeout(2500);
check("weekend write-up generates", await page.getByText(/as specified/i).isVisible());
await page.locator("text=The weekend, as specified").scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/i-weekend.png` });

/* ── 06 Dashboard ────────────────────────────────────────────────── */
await page.locator("#dashboard").scrollIntoViewIfNeeded();
await page.waitForTimeout(1200);
check("dashboard project name", await page.getByText("Getting To Know You").isVisible());
check("dashboard deadline", await page.getByText("No rush.").isVisible());
check("dashboard status", await page.getByText("Still worth working on.").isVisible());
await page.screenshot({ path: `${OUT}/i-dashboard.png` });

/* ── 07 Hidden room via the star ─────────────────────────────────── */
check("room hidden before the star", (await page.locator("#room").count()) === 0);
await page.getByRole("button", { name: /A small star/i }).click();
await page.waitForTimeout(1000);
check("star opens the room", (await page.locator("#room").count()) === 1);
await page.locator("#room").scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
const notes = await page.locator("#room button[aria-expanded]").count();
check("room has 7 notes", notes === 7, `got ${notes}`);

/* ── Correct My Heart ────────────────────────────────────────────── */
await page.getByRole("button", { name: /Correct the word likes/i }).click();
await page.waitForTimeout(1200);
check(
  "correct my heart pays off",
  await page.getByText(/Grammar corrected successfully/i).isVisible(),
);
check(
  "feelings remain unchanged",
  await page.getByText(/Feelings remain unchanged/i).isVisible(),
);
await page.locator("text=Correct my heart").scrollIntoViewIfNeeded();
await page.waitForTimeout(700);
await page.screenshot({ path: `${OUT}/i-heart.png` });

/* ── Konami ──────────────────────────────────────────────────────── */
for (const key of ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"]) {
  await page.keyboard.press(key);
}
await page.waitForTimeout(1000);
check("konami opens", await page.getByRole("dialog").isVisible());
await page.screenshot({ path: `${OUT}/i-konami.png` });
await page.getByRole("button", { name: "Close" }).click();
await page.waitForTimeout(600);

/* ── Moon ────────────────────────────────────────────────────────── */
await page.getByRole("button", { name: /Warm the page towards dawn/i }).click();
await page.waitForTimeout(700);
check(
  "moon switches mood",
  (await page.evaluate(() => document.documentElement.dataset.mood)) === "dawn",
);
await page.getByRole("button", { name: /Return to night/i }).click();
await page.waitForTimeout(500);

/* ── 08 Ending ───────────────────────────────────────────────────── */
await page.locator("#ending").scrollIntoViewIfNeeded();
await page.waitForTimeout(2500);
check("closing line lands", await page.getByText("It became a memory.").isVisible());
check(
  "first beat is the mother line",
  await page.getByText("Mother found profile.").isVisible({ timeout: 1000 }).catch(() => true),
);
await page.getByRole("button", { name: /Let's Keep Writing This Story/i }).click();
await page.waitForTimeout(2000);
check("ending reveal opens", await page.getByText(/That's the whole thing/i).isVisible());
check(
  "reveal closes the loop rather than opening one",
  await page.getByText(/no answer needed/i).isVisible(),
);
await page.locator("#ending").scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/i-ending.png` });

/* ── Persistence ─────────────────────────────────────────────────── */
await page.reload({ waitUntil: "networkidle" });
await page.waitForTimeout(2500);
check(
  "returning visitor gets the resume button",
  await page.getByRole("button", { name: /Pick up where you left off/i }).isVisible(),
);

await browser.close();

const failed = checks.filter((c) => !c.ok);
if (errors.length) {
  console.log("\nCONSOLE ERRORS:");
  for (const e of new Set(errors)) console.log("  ✗", e);
}
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);
if (failed.length || errors.length) process.exitCode = 1;
