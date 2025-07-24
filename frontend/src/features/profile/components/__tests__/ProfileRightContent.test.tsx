import { render, screen, fireEvent } from "@testing-library/react";
import { useProfile } from "../../context/ProfileContext";
import { useSections } from "../../context/SectionsContext";
import { StorageRefreshProvider } from "../../context/StorageRefreshContext";
import { ProfileRightContent } from "../ProfileRightContent";
import { FileDeletionProvider } from "../../context/FileDeletionContext";
import { Provider } from "react-redux";
import { store } from "@/app/redux/store";

vi.mock("../../context/ProfileContext", () => ({ useProfile: vi.fn() }));
vi.mock("../../context/SectionsContext", () => ({ useSections: vi.fn() }));

const mockUseProfile = useProfile as unknown as ReturnType<typeof vi.fn>;
const mockUseSections = useSections as unknown as ReturnType<typeof vi.fn>;

// Custom render to include all required context providers
const customRender = (ui: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <StorageRefreshProvider>
        <FileDeletionProvider>{ui}</FileDeletionProvider>
      </StorageRefreshProvider>
    </Provider>
  );
};
describe("ProfileRightContent", () => {
  const onBioChange = vi.fn();
  const updateSection = vi.fn();
  const deleteSection = vi.fn();
  const addSection = vi.fn();

  const defaultProps = {
    updateData: { bio: "This is a bio" },
    errorMessages: [],
    status: null,
    onBioChange,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("when there are not any sections", () => {
    it("renders the no-sections message", () => {
      mockUseProfile.mockReturnValue({ isEditing: false });
      mockUseSections.mockReturnValue({
        sections: [],
        updateSection,
        deleteSection,
        addSection,
      });

      customRender(<ProfileRightContent {...defaultProps} />);

      expect(screen.getByText(/No sections yet/i)).toBeInTheDocument();
    });
  });

  describe("when not editing and sections exist", () => {
    it("renders section titles and descriptions as text", () => {
      mockUseProfile.mockReturnValue({ isEditing: false });
      mockUseSections.mockReturnValue({
        sections: [
          {
            id: 1,
            title: "Section 1",
            description: "Description 1",
            isPublic: true,
          },
        ],
        updateSection,
        deleteSection,
        addSection,
      });

      customRender(<ProfileRightContent {...defaultProps} />);

      expect(screen.getByText("Section 1")).toBeInTheDocument();
      expect(screen.getByText("Description 1")).toBeInTheDocument();
    });
  });

  describe("when editing", () => {
    it("renders editable inputs and handles changes", () => {
      mockUseProfile.mockReturnValue({ isEditing: true });
      mockUseSections.mockReturnValue({
        sections: [
          {
            id: 1,
            title: "Section 1",
            description: "Description 1",
            isPublic: true,
          },
        ],
        updateSection,
        deleteSection,
        addSection,
      });

      customRender(<ProfileRightContent {...defaultProps} />);

      // Editable input fields appear
      const titleInput = screen.getByDisplayValue("Section 1");
      const descTextarea = screen.getByDisplayValue("Description 1");
      expect(titleInput).toBeInTheDocument();
      expect(descTextarea).toBeInTheDocument();

      // Title input change triggers updateSection
      fireEvent.change(titleInput, { target: { value: "Updated Title" } });
      expect(updateSection).toHaveBeenCalledWith(0, "title", "Updated Title");

      // Description change triggers updateSection
      fireEvent.change(descTextarea, { target: { value: "Updated Desc" } });
      expect(updateSection).toHaveBeenCalledWith(
        0,
        "description",
        "Updated Desc"
      );

      // Delete button triggers deleteSection with section ID
      const deleteBtn = screen.getByText("Delete Section");
      fireEvent.click(deleteBtn);
      expect(deleteSection).toHaveBeenCalledWith(1);

      // Add section button triggers addSection
      const addBtn = screen.getByText("Add new section");
      fireEvent.click(addBtn);
      expect(addSection).toHaveBeenCalled();
    });

    it("should render error messages when bio or section title are empty on save", () => {
      mockUseProfile.mockReturnValue({ isEditing: true });
      mockUseSections.mockReturnValue({
        sections: [{ id: 1, title: "", description: "Desc", isPublic: true }],
        updateSection,
        deleteSection,
        addSection,
      });

      const errorMessages = [
        "bio cannot be empty",
        "section title cannot be empty",
      ];
      const status = 400;

      customRender(
        <ProfileRightContent
          updateData={{ bio: "" }}
          errorMessages={errorMessages}
          status={status}
          onBioChange={onBioChange}
        />
      );

      expect(screen.getByText(/bio cannot be empty/i)).toBeInTheDocument();
      expect(
        screen.getByText(/section title cannot be empty/i)
      ).toBeInTheDocument();
    });
  });
});
