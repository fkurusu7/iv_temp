import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Header from "./Header";

describe("Header component", () => {
  it("renders both headings correctly", () => {
    render(<Header />);

    const firstHeading = screen.getByText("Reliable, efficient delivery");
    const secondHeading = screen.getByText("Powered by Technology");

    expect(firstHeading).toBeInTheDocument();
    expect(secondHeading).toBeInTheDocument();
  });

  it("applies correct classes to headings", () => {
    render(<Header />);

    const firstHeading = screen.getByText("Reliable, efficient delivery");
    const secondHeading = screen.getByText("Powered by Technology");

    expect(firstHeading).toHaveClass("isLight");
    expect(secondHeading).toHaveClass("isBold");
  });
});
