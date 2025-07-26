import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TermsAndConditions } from "../TermsAndConditions/TermsAndConditions";

describe("TermsAndConditions", () => {
  it("should call onUnderstand when clicking I understand button", () => {
    const mockOnUnderstand = vi.fn();

    render(<TermsAndConditions onUnderstand={mockOnUnderstand} />);

    const button = screen.getByRole("button", { name: /I understand/i });
    fireEvent.click(button);

    expect(mockOnUnderstand).toHaveBeenCalledTimes(1);
  });
});
