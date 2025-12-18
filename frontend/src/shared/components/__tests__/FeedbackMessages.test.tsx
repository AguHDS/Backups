import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ValidationMessages } from "../ValidationMessages/ValidationMessages";

describe("FeedbackMessages", () => {
  it("renders nothing if input is empty and status is null", () => {
    const { container } = render(
      <ValidationMessages input={[]} status={null} message={null} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("renders input warnings with warning styles", () => {
    const warnings = ["Field is required", "Username too short"];

    render(
      <ValidationMessages input={warnings} status={null} message={null} />
    );

    for (const msg of warnings) {
      const element = screen.getByText(msg);

      expect(element).not.toBeNull();
      expect(element.classList.contains("flex")).toBe(true);
      expect(element.classList.contains("justify-center")).toBe(true);
      expect(element.classList.contains("text-center")).toBe(true);
      expect(element.classList.contains("text-red-600")).toBe(true);
      expect(element.classList.contains("mb-0")).toBe(true);
      expect(element.classList.contains("relative")).toBe(true);
    }
  });

  it("renders success message with success styles when status is 200", () => {
    render(
      <ValidationMessages
        input={[]}
        status={200}
        message="Account created successfully"
      />
    );

    const element = screen.getByText("Account created successfully");

    expect(element).not.toBeNull();
    expect(element.classList.contains("flex")).toBe(true);
    expect(element.classList.contains("justify-center")).toBe(true);
    expect(element.classList.contains("text-green-600")).toBe(true);
    expect(element.classList.contains("mb-0")).toBe(true);
    expect(element.classList.contains("relative")).toBe(true);
  });

  it("renders error message with warning styles when status is 400", () => {
    render(
      <ValidationMessages
        input={[]}
        status={400}
        message="Invalid credentials"
      />
    );

    const element = screen.getByText("Invalid credentials");

    expect(element).not.toBeNull();
    expect(element.classList.contains("flex")).toBe(true);
    expect(element.classList.contains("justify-center")).toBe(true);
    expect(element.classList.contains("text-red-600")).toBe(true);
    expect(element.classList.contains("mb-0")).toBe(true);
    expect(element.classList.contains("relative")).toBe(true);
  });

  it("renders both input warnings and status message together", () => {
    render(
      <ValidationMessages
        input={["Missing password"]}
        status={500}
        message="Server error"
      />
    );

    expect(screen.getByText("Missing password")).not.toBeNull();
    expect(screen.getByText("Server error")).not.toBeNull();
  });
});
