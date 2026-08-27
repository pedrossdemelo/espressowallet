// End-to-end pass over the authed wallet, driven against the Firebase
// emulators so it never touches the production project.
//
//   1. npx firebase emulators:start --only auth,firestore   (needs a JRE)
//   2. VITE_USE_FIREBASE_EMULATORS=true npm run dev         (or build + preview)
//   3. npm run test:e2e
//
// Needs Google Chrome installed at the path below. Not wired into CI, which
// has no browser.
import puppeteer from "puppeteer-core";
const BASE = "http://127.0.0.1:3000";
const AUTH = "http://127.0.0.1:9099";
const PROJECT = "espressowallet";
const TAG = process.argv[2] || "run";
const SHOT = process.argv[3] || ".";
const sleep = ms => new Promise(r => setTimeout(r, ms));

const b = await puppeteer.launch({
  executablePath:
    process.env.CHROME_PATH ??
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: "new",
  args: ["--no-sandbox"],
});
const p = await b.newPage();
await p.setViewport({
  width: 420,
  height: 900,
  hasTouch: true,
  isMobile: true,
});

const errs = [];
p.on("pageerror", e => errs.push("pageerror: " + e.message.split("\n")[0]));
p.on("console", m => {
  const t = m.text();
  if (m.type() === "error") errs.push("error: " + t.slice(0, 220));
  if (
    m.type() === "warning" &&
    /react|deprecat|UNSAFE|findDOMNode|createRoot|hydrat/i.test(t)
  )
    errs.push("warn: " + t.slice(0, 220));
});

const results = [];
const step = async (name, fn) => {
  try {
    await fn();
    results.push("PASS  " + name);
  } catch (e) {
    results.push("FAIL  " + name + " :: " + e.message.split("\n")[0]);
  }
};
const clickText = async re => {
  const els = await p.$$('button, [role="button"], [role="option"], li');
  for (const el of els) {
    const label = await p.evaluate(n => (n.innerText || "").trim(), el);
    if (re.test(label)) {
      await el.click();
      return true;
    }
  }
  throw new Error("no element matching " + re);
};
const email = `e2e-${Date.now()}@example.test`;

await step("app loads to login", async () => {
  await p.goto(BASE, { waitUntil: "networkidle2", timeout: 45000 });
  await p.waitForSelector('input[type="password"]', { timeout: 20000 });
});

await step("sign up shows pending-verification screen", async () => {
  await p.type('input[type="email"]', email);
  await p.type('input[type="password"]', "password123");
  await clickText(/^SIGN UP$/i);
  await p.waitForFunction(
    () => /Check your email/i.test(document.body.innerText),
    { timeout: 25000 },
  );
});
await p.screenshot({ path: `${SHOT}/${TAG}-1-pending.png` });

await step("verify email via emulator oobCode", async () => {
  const r = await fetch(`${AUTH}/emulator/v1/projects/${PROJECT}/oobCodes`);
  const { oobCodes } = await r.json();
  const mine = oobCodes.filter(c => c.email === email).pop();
  if (!mine) throw new Error("no oobCode for " + email);
  const v = await fetch(mine.oobLink);
  if (!v.ok) throw new Error("verify link " + v.status);
});

await step("'I've verified' reaches the wallet", async () => {
  await Promise.all([
    p
      .waitForNavigation({ waitUntil: "networkidle2", timeout: 30000 })
      .catch(() => {}),
    clickText(/I.VE VERIFIED/i),
  ]);
  await p.waitForFunction(() => location.pathname === "/", { timeout: 30000 });
  await p.waitForFunction(() => /Balance/i.test(document.body.innerText), {
    timeout: 25000,
  });
});
await p.screenshot({ path: `${SHOT}/${TAG}-2-wallet.png` });

await step("onboarding: save base currency", async () => {
  await p.waitForFunction(
    () => /Welcome to Espresso/i.test(document.body.innerText),
    { timeout: 20000 },
  );
  await clickText(/^SAVE$/i);
  await p.waitForFunction(
    () => !/Welcome to Espresso/i.test(document.body.innerText),
    { timeout: 20000 },
  );
});

const visibleDrawerInputs = () =>
  p.evaluate(() =>
    [...document.querySelectorAll(".MuiDrawer-root input")]
      .filter(i => i.getClientRects().length > 0)
      .map(i => ({
        name: i.getAttribute("name") || "",
        id: i.getAttribute("id") || "",
        label: (i.closest(".MuiFormControl-root")?.innerText || "").split(
          "\n",
        )[0],
        value: i.value,
      })),
  );

await step("open add-transaction drawer (FAB -> Expense)", async () => {
  await p.click(".MuiSpeedDial-fab");
  await sleep(800);
  const actions = await p.$$(".MuiSpeedDialAction-fab");
  if (!actions.length) throw new Error("speed dial actions did not open");
  await actions[0].click();
  await p.waitForFunction(
    () =>
      [...document.querySelectorAll(".MuiDrawer-root input")].filter(
        i => i.getClientRects().length > 0,
      ).length >= 3,
    { timeout: 20000 },
  );
  await sleep(600);
});
await p.screenshot({ path: `${SHOT}/${TAG}-3-form.png` });

await step("DateTimePicker renders a formatted value", async () => {
  const fields = await visibleDrawerInputs();
  const v = fields.find(f => /\d{2}\/\d{2}\/\d{4}/.test(f.value));
  if (!v) throw new Error("no date value; fields=" + JSON.stringify(fields));
});

await step("add a transaction", async () => {
  const focused = await p.evaluate(() => {
    const input = [...document.querySelectorAll(".MuiDrawer-root input")]
      .filter(i => i.getClientRects().length > 0)
      .find(i =>
        /description/i.test(i.closest(".MuiFormControl-root")?.innerText || ""),
      );
    if (!input) return false;
    input.focus();
    return true;
  });
  if (!focused) throw new Error("no description field");
  await p.keyboard.type("e2e coffee");

  const err = await p.evaluate(() => {
    const btns = [
      ...document.querySelectorAll(".MuiDrawer-root button"),
    ].filter(b => b.getClientRects().length > 0);
    const submit = btns.find(b =>
      /add (expense|income)|^add$|save|confirm/i.test(b.innerText),
    );
    if (!submit)
      return (
        [...new Set(btns.map(b => b.innerText.trim()))].join(",") || "none"
      );
    submit.click();
    return null;
  });
  if (err) throw new Error("no submit button; buttons: " + err);
  await p.waitForFunction(() => /e2e coffee/i.test(document.body.innerText), {
    timeout: 25000,
  });
});

await p.screenshot({ path: `${SHOT}/${TAG}-4-added.png` });

const rowBox = async () =>
  p.evaluate(() => {
    const el = [...document.querySelectorAll("li,.MuiListItem-root")].find(n =>
      /e2e coffee/i.test(n.innerText),
    );
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });
const drag = async (box, dir) => {
  const y = box.y + box.h / 2;
  const from = dir > 0 ? box.x + box.w * 0.15 : box.x + box.w * 0.85;
  await p.touchscreen.touchStart(from, y);
  for (let i = 1; i <= 8; i++) {
    await p.touchscreen.touchMove(from + dir * box.w * 0.5 * (i / 8), y);
    await sleep(40);
  }
  await sleep(120);
  await p.touchscreen.touchEnd();
  await sleep(1200);
};

await step("swipe towards end opens the delete confirmation", async () => {
  // The speed dial is still open from adding the transaction and its backdrop
  // would swallow the first gesture.
  await p.keyboard.press("Escape");
  await sleep(700);
  const box = await rowBox();
  if (!box) throw new Error("row not found");
  await drag(box, +1);
  const ok = await p.evaluate(() =>
    /delete|are you sure|confirm/i.test(
      document.querySelector(".MuiDialog-root")?.innerText || "",
    ),
  );
  if (!ok)
    throw new Error(
      "no delete dialog; body=" +
        (await p.evaluate(() =>
          document.body.innerText.replace(/\s+/g, " ").slice(0, 140),
        )),
    );
});
await p.screenshot({ path: `${SHOT}/${TAG}-5-swipe-delete.png` });

await step("swipe the other way opens the edit drawer", async () => {
  await p.keyboard.press("Escape");
  await p.waitForFunction(
    () =>
      ![...document.querySelectorAll(".MuiDialog-root")].some(
        d => d.getClientRects().length > 0,
      ),
    { timeout: 10000 },
  );
  await sleep(800);
  const box = await rowBox();
  if (!box) throw new Error("row gone");
  await drag(box, -1);
  const ok = await p.evaluate(() =>
    [...document.querySelectorAll(".MuiDrawer-root")].some(
      d =>
        d.getClientRects().length > 0 &&
        /value/i.test(d.innerText) &&
        /currency/i.test(d.innerText),
    ),
  );
  if (!ok) throw new Error("no edit drawer");
});

await p.screenshot({ path: `${SHOT}/${TAG}-5-swipe.png` });

await step("settings route renders", async () => {
  await p.goto(BASE + "/settings", {
    waitUntil: "networkidle2",
    timeout: 30000,
  });
  await p.waitForFunction(
    () =>
      location.pathname === "/settings" &&
      document.body.innerText.trim().length > 40,
    { timeout: 25000 },
  );
});
await p.screenshot({ path: `${SHOT}/${TAG}-6-settings.png` });

console.log("=== " + TAG + " ===");
console.log(results.join("\n"));
console.log(
  "issues:",
  errs.length ? "\n  " + [...new Set(errs)].join("\n  ") : "none",
);
await b.close();
