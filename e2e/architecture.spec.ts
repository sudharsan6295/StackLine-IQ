import { test, expect } from "@playwright/test";

test("architecture page renders the canvas, legend, and accessible directory", async ({
  page,
}) => {
  await page.goto("/architecture");
  await expect(
    page.getByRole("heading", {
      name: "How the whole AI-augmented lifecycle fits together",
    }),
  ).toBeVisible();
  await expect(page.getByText("Outgoing connections")).toBeVisible();
  await expect(page.locator(".react-flow")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Every function, in detail" }),
  ).toBeVisible();
  // All 14 functions and all 7 phases render as canvas nodes.
  await expect(
    page.locator('.react-flow__node[data-id^="function:"]'),
  ).toHaveCount(14);
  await expect(
    page.locator('.react-flow__node[data-id^="phase:"]'),
  ).toHaveCount(7);
});

test("clicking a function node opens its detail panel with subtypes and connections", async ({
  page,
}) => {
  await page.goto("/architecture");
  await page.locator('.react-flow__node[data-id="function:sales"]').click();

  const panel = page.getByTestId("architecture-detail-panel");
  await expect(
    panel.getByRole("heading", { name: "Sales", exact: true }),
  ).toBeVisible();
  await expect(panel.getByText("Prospecting & lead enrichment")).toBeVisible();
  await expect(
    panel.getByText("Hands off qualified leads to the sales pipeline"),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Reset view" })).toBeVisible();
});

test("clicking a connected-function chip pivots the selection", async ({
  page,
}) => {
  await page.goto("/architecture");
  const panel = page.getByTestId("architecture-detail-panel");
  await page.locator('.react-flow__node[data-id="function:sales"]').click();
  await panel
    .getByRole("button", { name: /Marketing.*Hands off qualified leads/ })
    .click();
  await expect(panel.getByText("SEO & AI-search optimization")).toBeVisible();
});

test("clicking a phase node shows its active functions and top picks", async ({
  page,
  isMobile,
}) => {
  // ReactFlow's fitView packs 21 nodes into a very small canvas at 375px
  // wide, and panning/zooming to reach a specific node reliably needs real
  // touch gestures rather than a plain click — covered on desktop instead.
  test.skip(
    isMobile,
    "canvas pan/zoom interaction isn't exercised on narrow mobile viewports",
  );

  await page.goto("/architecture");
  const panel = page.getByTestId("architecture-detail-panel");
  await page
    .locator('.react-flow__node[data-id="phase:ideation-discovery"]')
    .click();
  await expect(panel.getByText("Functions active in this stage")).toBeVisible();
  await expect(panel.getByText("Top-pick tools for this stage")).toBeVisible();
});

test("the accessible directory links to real function and tool pages", async ({
  page,
}) => {
  await page.goto("/architecture");
  const salesCard = page.locator("article#function-sales");
  await expect(salesCard).toBeVisible();
  await expect(
    salesCard.getByRole("link", { name: "Full function page" }),
  ).toHaveAttribute("href", "/functions/sales");
});
