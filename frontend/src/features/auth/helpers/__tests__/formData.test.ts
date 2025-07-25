import { describe, it, expect } from "vitest";
import { getFormData } from "../formData";

function createForm(fields: Record<string, string>): HTMLFormElement {
  const form = document.createElement("form");

  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.name = name;
    input.type = "text";
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  return form;
}

describe("getFormData", () => {
  it("returns login form data correctly", () => {
    const form = createForm({
      user: "testuser",
      password: "123456",
    });

    const result = getFormData(form);
    expect(result).toEqual({
      user: "testuser",
      password: "123456",
    });
  });

  it("returns registration form data correctly", () => {
    const form = createForm({
      user: "newuser",
      password: "abc123",
      email: "newuser@example.com",
    });

    const result = getFormData(form);
    expect(result).toEqual({
      user: "newuser",
      password: "abc123",
      email: "newuser@example.com",
    });
  });

  it("throws an error if required fields are missing", () => {
    const form = createForm({
      email: "user@example.com",
    });

    expect(() => getFormData(form)).toThrow("Form does not have a valid format");
  });

  it("throws if field names are incorrect (force fail)", () => {
    const form = createForm({
      userx: "badname",
      passwordx: "badpass",
    });

    expect(() => getFormData(form)).toThrow("Form does not have a valid format");
  });
});
