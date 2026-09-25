import { describe, expect, it } from "vitest";
import {
  applyFilters,
  defaultFilters,
  isFiltersEmpty,
  type ToolFilters,
} from "@/lib/filter-tools";
import type { Tool } from "@/lib/schema";

function makeTool(overrides: Partial<Tool>): Tool {
  return {
    id: "test-tool",
    name: "Test Tool",
    bestFor: "Testing things",
    description: "A tool used only in tests.",
    functions: ["software-development"],
    phases: ["build"],
    pricingModel: "freemium",
    badge: "Freemium",
    freeTier: { available: true, limits: "Free tier" },
    paidTier: {
      isCustomPricing: false,
      startingPrice: 20,
      currency: "USD",
      billingUnit: "per month",
    },
    topPick: false,
    enterpriseReady: true,
    officialUrl: "https://example.com",
    sourceUrl: "https://example.com/pricing",
    lastChecked: "2026-01-01",
    ...overrides,
  };
}

describe("applyFilters", () => {
  const tools = [
    makeTool({
      id: "a",
      functions: ["software-development"],
      phases: ["build"],
      badge: "Freemium",
      enterpriseReady: true,
    }),
    makeTool({
      id: "b",
      functions: ["marketing"],
      phases: ["go-to-market-sales"],
      badge: "Paid",
      pricingModel: "paid",
      enterpriseReady: false,
      freeTier: { available: false },
      paidTier: {
        isCustomPricing: false,
        startingPrice: 200,
        currency: "USD",
        billingUnit: "per month",
      },
    }),
    makeTool({
      id: "c",
      functions: ["software-development", "qa-testing"],
      phases: ["test-qa"],
      badge: "Free",
      freeTier: { available: true },
      paidTier: { isCustomPricing: true },
    }),
  ];

  it("returns all tools when filters are empty", () => {
    expect(applyFilters(tools, defaultFilters)).toHaveLength(3);
  });

  it("filters by function", () => {
    const filters: ToolFilters = {
      ...defaultFilters,
      functions: ["marketing"],
    };
    const result = applyFilters(tools, filters);
    expect(result.map((t) => t.id)).toEqual(["b"]);
  });

  it("filters by phase", () => {
    const filters: ToolFilters = { ...defaultFilters, phases: ["test-qa"] };
    expect(applyFilters(tools, filters).map((t) => t.id)).toEqual(["c"]);
  });

  it("filters by badge", () => {
    const filters: ToolFilters = { ...defaultFilters, badges: ["Paid"] };
    expect(applyFilters(tools, filters).map((t) => t.id)).toEqual(["b"]);
  });

  it("filters by enterprise-ready", () => {
    const filters: ToolFilters = { ...defaultFilters, enterpriseOnly: true };
    // "b" is the only tool marked not enterprise-ready
    expect(applyFilters(tools, filters).map((t) => t.id)).toEqual(["a", "c"]);
  });

  it("filters by max price, treating any tool with a free tier as within budget", () => {
    const filters: ToolFilters = { ...defaultFilters, maxPrice: 50 };
    // "a" and "c" both have a free tier (price 0); "b" is $200/mo with no free tier
    expect(applyFilters(tools, filters).map((t) => t.id)).toEqual(["a", "c"]);
  });

  it("excludes custom-priced tools with no free tier from a max price filter", () => {
    const customPaid = makeTool({
      id: "d",
      pricingModel: "paid",
      freeTier: { available: false },
      paidTier: { isCustomPricing: true },
    });
    const filters: ToolFilters = { ...defaultFilters, maxPrice: 50 };
    expect(
      applyFilters([...tools, customPaid], filters).map((t) => t.id),
    ).toEqual(["a", "c"]);
  });

  it("respects a pre-computed search match set", () => {
    const matched = new Set(["b"]);
    expect(
      applyFilters(tools, defaultFilters, matched).map((t) => t.id),
    ).toEqual(["b"]);
  });

  it("combines multiple filters with AND semantics", () => {
    const filters: ToolFilters = {
      ...defaultFilters,
      functions: ["software-development"],
      phases: ["test-qa"],
    };
    expect(applyFilters(tools, filters).map((t) => t.id)).toEqual(["c"]);
  });
});

describe("isFiltersEmpty", () => {
  it("is true for the default filters", () => {
    expect(isFiltersEmpty(defaultFilters)).toBe(true);
  });

  it("is false once any field is set", () => {
    expect(isFiltersEmpty({ ...defaultFilters, q: "gpt" })).toBe(false);
    expect(isFiltersEmpty({ ...defaultFilters, enterpriseOnly: true })).toBe(
      false,
    );
    expect(isFiltersEmpty({ ...defaultFilters, maxPrice: 0 })).toBe(false);
  });
});
