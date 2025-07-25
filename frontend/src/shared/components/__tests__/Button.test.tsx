import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Button } from "../buttons/Button";

describe("Button", () => {
  it("renders with default label", () => {
    render(<Button />);
    expect(screen.getByRole("button")).toHaveTextContent("Button");
  });

  it("renders with custom label", () => {
    render(<Button label="Click me" />);
    expect(screen.getByRole("button")).toHaveTextContent("Click me");
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick} label="Click me" />);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("calls onKeyDown handler when key is pressed", () => {
    const handleKeyDown = vi.fn();
    render(<Button onKeyDown={handleKeyDown} />);
    fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });
    expect(handleKeyDown).toHaveBeenCalledTimes(1);
  });

  it("applies className, type, id and style props", () => {
    render(
      <Button
        label="Styled"
        id="my-button"
        className="my-class"
        type="submit"
        style={{ backgroundColor: "red" }}
      />
    );
    const btn = screen.getByRole("button");

    expect(btn).toHaveAttribute("id", "my-button");
    expect(btn).toHaveClass("my-class");
    expect(btn).toHaveAttribute("type", "submit");
    expect(btn.getAttribute("style")).toContain("background-color: red");
  });
});
