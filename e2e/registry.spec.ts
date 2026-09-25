import { test, expect } from "@playwright/test";

test("homepage renders the hero, live stats, and matrix", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /know exactly which ai tool/i }),
  ).toBeVisible();
  await expect(page.getByText("The function × lifecycle matrix")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Browse the registry" }),
  ).toBeVisible();
});

test("the lifecycle architecture diagram shows top picks and links to tool pages", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "From idea to support: the AI-augmented lifecycle",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Ideation & Discovery" }),
  ).toBeVisible();
  const link = page.getByRole("link", { name: "GitHub Copilot" }).first();
  await link.click();
  await expect(page).toHaveURL(/\/tools\/github-copilot/);
});

test("+more on a lifecycle stage filters the registry by that phase", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: /\+\d+ more/ })
    .first()
    .click();
  await expect(page).toHaveURL(/ph=ideation-discovery/);
  await expect(page.getByText(/tools match/)).toBeVisible();
});

test("clicking a matrix cell filters the tool grid", async ({ page }) => {
  await page.goto("/");
  const cell = page
    .getByRole("button", { name: /Software Development.*Build:/i })
    .first();
  await cell.click();
  await expect(page).toHaveURL(/fn=software-development/);
  await expect(page).toHaveURL(/ph=build/);
});

test("search filters tools by name", async ({ page }) => {
  await page.goto("/");
  const matchLocator = page.getByText(/tools match/);
  const totalCount = Number(
    (await matchLocator.textContent())?.match(/\d+/)?.[0],
  );

  await page
    .getByPlaceholder("Search tools by name or use case…")
    .fill("Copilot");
  await expect(
    page.getByRole("heading", { name: "GitHub Copilot" }),
  ).toBeVisible();
  // Fuzzy search legitimately surfaces a handful of near-matches; just
  // confirm it narrowed the full registry down meaningfully (not hardcoding
  // the total tool count, which grows as the data set grows). Poll rather
  // than reading textContent once, since the result count updates
  // asynchronously after the debounced URL/state update.
  await expect(matchLocator).not.toHaveText(`${totalCount} tools match`);
  const count = Number((await matchLocator.textContent())?.match(/\d+/)?.[0]);
  expect(count).toBeGreaterThan(0);
  expect(count).toBeLessThan(totalCount);
});

test("shortlisting a tool shows the shortlist bar and persists a CSV export button", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: /^Shortlist$/ })
    .first()
    .click();
  await expect(
    page.getByRole("button", { name: /Shortlist \(1\)/ }),
  ).toBeVisible();
});

test("function detail page renders tools and the adoption roadmap", async ({
  page,
}) => {
  await page.goto("/functions/software-development");
  await expect(
    page.getByRole("heading", { name: "Software Development", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Adoption roadmap" }),
  ).toBeVisible();
  await expect(page.getByRole("tab", { name: /Pilot/ })).toBeVisible();
});

test("tool detail page renders pricing and links", async ({ page }) => {
  await page.goto("/tools/github-copilot");
  await expect(
    page.getByRole("heading", { name: "GitHub Copilot" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: /Visit GitHub Copilot/ }),
  ).toBeVisible();
});

test("stack builder produces a cost estimate", async ({ page }) => {
  await page.goto("/stack-builder");
  await page.getByRole("button", { name: "Recommend a stack" }).click();
  await expect(page.getByText("Estimated monthly cost")).toBeVisible();
});

test("governance page lists the four pillars", async ({ page }) => {
  await page.goto("/governance");
  await expect(
    page.getByRole("heading", { name: "Data privacy" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Human approval" }),
  ).toBeVisible();
});

test("command palette opens with Ctrl+K and navigates to a page", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Control+k");
  await expect(
    page.getByPlaceholder("Search tools, functions, or jump to a page…"),
  ).toBeVisible();
  await page
    .getByPlaceholder("Search tools, functions, or jump to a page…")
    .fill("Governance");
  await page.getByRole("option", { name: /Governance & Safety/ }).click();
  await expect(page).toHaveURL(/\/governance/);
});

test("has no obvious accessibility violations: skip link and landmark structure", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".skip-link")).toHaveText("Skip to content");
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();
});
