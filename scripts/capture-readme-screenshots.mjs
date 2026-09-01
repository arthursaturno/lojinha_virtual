import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const baseUrl = "http://localhost:3000";
const outputDirectory = "docs/screenshots";

async function captureCatalog(page, fileName) {
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${outputDirectory}/${fileName}` });
}

async function captureProductDrawer(page, fileName) {
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.locator("button.bg-white.text-left").first().click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${outputDirectory}/${fileName}` });
}

async function captureCart(page, fileName) {
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.locator("button.bg-white.text-left").first().click();
  const optionGroups = page.locator("fieldset");
  for (let index = 0; index < await optionGroups.count(); index += 1) {
    await optionGroups.nth(index).locator("button").first().click();
  }
  await page.getByText("ADICIONAR AO CARRINHO", { exact: true }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${outputDirectory}/${fileName}` });
}

await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch({ headless: true });

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 960 } });
  await captureCatalog(desktop, "catalog-desktop.png");
  await captureProductDrawer(desktop, "product-drawer-desktop.png");
  await desktop.goto(`${baseUrl}/admin/login`, { waitUntil: "networkidle" });
  await desktop.screenshot({ path: `${outputDirectory}/admin-login-desktop.png` });

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
  await captureCatalog(mobile, "catalog-mobile.png");
  await captureProductDrawer(mobile, "product-drawer-mobile.png");
  await captureCart(mobile, "cart-mobile.png");
} finally {
  await browser.close();
}
