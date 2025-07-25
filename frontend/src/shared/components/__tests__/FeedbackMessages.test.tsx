import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { FeedbackMessages } from "../FeedbackMessages/FeedbackMessages";
import styles from "../FeedbackMessages/feedbackMessages.module.css";

describe("FeedbackMessages", () => {
  it("renders nothing if input is empty and status is null", () => {
    render(<FeedbackMessages input={[]} status={null} message={null} />);
    expect(screen.queryByText(/./)).toBeNull();
  });

  it("renders input warnings", () => {
    const warnings = ["Field is required", "Username too short"];
    render(<FeedbackMessages input={warnings} status={null} message={null} />);
    for (const msg of warnings) {
      expect(screen.getByText(msg)).toBeInTheDocument();
      expect(screen.getByText(msg)).toHaveClass(styles.warningsLoginAndSign);
    }
  });

  it("renders success message with correct class when status is 200", () => {
    render(
      <FeedbackMessages
        input={[]}
        status={200}
        message="Account created successfully"
      />
    );
    const message = screen.getByText("Account created successfully");
    expect(message).toBeInTheDocument();
    expect(message).toHaveClass(styles.loginAndSignSuccesfull);
  });

  it("renders error message with correct class when status is 400", () => {
    render(
      <FeedbackMessages input={[]} status={400} message="Invalid credentials" />
    );
    const message = screen.getByText("Invalid credentials");
    expect(message).toBeInTheDocument();
    expect(message).toHaveClass(styles.warningsLoginAndSign);
  });

  it("renders both input warnings and status message together", () => {
    render(
      <FeedbackMessages
        input={["Missing password"]}
        status={500}
        message="Server error"
      />
    );
    expect(screen.getByText("Missing password")).toBeInTheDocument();
    expect(screen.getByText("Server error")).toBeInTheDocument();
  });
});
