import { render, screen } from "@testing-library/react";
import { ActionsAndProfileImg } from "../ActionsAndProfileImg";
import { BrowserRouter } from "react-router-dom";

describe("ActionsAndProfileImg", () => {
  const props = {
    profilePic: "https://example.com/profile.jpg",
    giftIcon: "https://example.com/gift.png",
    msgIcon: "https://example.com/msg.png",
    addPartnerIcon: "https://example.com/add.png",
  };

  const renderWithRouter = (ui: React.ReactElement) => render(<BrowserRouter>{ui}</BrowserRouter>);

  it("renders the profile picture", () => {
    renderWithRouter(<ActionsAndProfileImg {...props} />);
    expect(screen.getByAltText("Profile")).toHaveAttribute("src", props.profilePic);
  });
});
