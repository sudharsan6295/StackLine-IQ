import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToolCard } from "@/components/tool-card";
import type { Tool } from "@/lib/schema";

const tool: Tool = {
  id: "test-tool",
  name: "Test Tool",
  logoInitial: "TT",
  bestFor: "Doing test things well",
  description: "A tool used only in tests.",
  functions: ["software-development"],
  phases: ["build"],
  pricingModel: "freemium",
  badge: "Freemium",
  freeTier: { available: true, limits: "100 free requests/month" },
  paidTier: {
    isCustomPricing: false,
    startingPrice: 20,
    currency: "USD",
    billingUnit: "per month",
  },
  topPick: true,
  enterpriseReady: true,
  officialUrl: "https://example.com",
  sourceUrl: "https://example.com/pricing",
  lastChecked: "2026-01-01",
  addedOn: "2026-01-01",
};

describe("ToolCard", () => {
  it("renders the tool name, best-for line, price, and top pick flag", () => {
    render(<ToolCard tool={tool} onOpenDetails={vi.fn()} />);
    expect(screen.getByText("Test Tool")).toBeInTheDocument();
    expect(screen.getByText("Doing test things well")).toBeInTheDocument();
    expect(screen.getByText("$20/mo")).toBeInTheDocument();
    expect(screen.getByText("Top pick")).toBeInTheDocument();
  });

  it("calls onOpenDetails with the tool when the card body is clicked", async () => {
    const onOpenDetails = vi.fn();
    render(<ToolCard tool={tool} onOpenDetails={onOpenDetails} />);
    await userEvent.click(screen.getByText("Test Tool"));
    expect(onOpenDetails).toHaveBeenCalledWith(tool);
  });

  it("toggles the shortlist button label when clicked", async () => {
    render(<ToolCard tool={tool} onOpenDetails={vi.fn()} />);
    const button = screen.getByRole("button", { name: /shortlist/i });
    await userEvent.click(button);
    expect(
      screen.getByRole("button", { name: "Shortlisted" }),
    ).toBeInTheDocument();
  });
});
