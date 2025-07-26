import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "../inputs/Input";

describe("Input component", () => {
  it("renders with default props", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "text");
    expect(input).toHaveAttribute("autoComplete", "off");
  });

  it("renders with custom props", () => {
    render(
      <Input
        type="email"
        placeholder="Enter your email"
        value="test@example.com"
        disabled
        required
        autoComplete="on"
        name="email"
      />
    );
    const input = screen.getByPlaceholderText("Enter your email");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveValue("test@example.com");
    expect(input).toBeDisabled();
    expect(input).toBeRequired();
    expect(input).toHaveAttribute("autoComplete", "on");
  });

  it("calls onChange when typing", () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} />);
    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "hello" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("renders checkbox type correctly", () => {
    const handleChange = vi.fn();
    render(<Input type="checkbox" checked={true} onChange={handleChange} />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalled();
  });
});
