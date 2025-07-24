import {
  describe,
  it,
  vi,
  type Mock,
  expect,
  beforeEach,
  afterEach,
} from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { SectionFileManager } from "../SectionFileManager";
import {
  useProfile,
  useSections,
  useStorageRefresh,
  useFileDeletion,
} from "../../context";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

// Mocks for all external hooks used by the component
vi.mock("../../context", () => ({
  useProfile: vi.fn(),
  useSections: vi.fn(),
  useStorageRefresh: vi.fn(),
  useFileDeletion: vi.fn(),
}));

vi.mock("react-router-dom", async (mod) => ({
  ...(await mod),
  useParams: vi.fn(),
}));
vi.mock("react-redux", async (mod) => ({
  ...(await mod),
  useDispatch: vi.fn(),
}));

const mockUseProfile = useProfile as Mock;
const mockUseSections = useSections as Mock;
const mockUseStorageRefresh = useStorageRefresh as Mock;
const mockUseFileDeletion = useFileDeletion as Mock;
const mockUseParams = useParams as Mock;
const mockUseDispatch = useDispatch as unknown as Mock;

describe("SectionFileManager", () => {
  const mockRenderFiles = vi.fn();
  const mockAddFilesToDelete = vi.fn();
  const mockRefresh = vi.fn();
  const mockDispatch = vi.fn();
  const file1 = {
    publicId: "file1",
    url: "https://example.com/file1.jpg",
    sectionId: "1",
    sizeInBytes: 123,
    userId: 42,
  };
  const file2 = {
    publicId: "file2",
    url: "https://example.com/file2.jpg",
    sectionId: "1",
    sizeInBytes: 456,
    userId: 42,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Initial mock values for all hooks
    mockUseProfile.mockReturnValue({
      isEditing: true,
      isOwnProfile: true,
      setIsEditing: vi.fn(),
    });

    mockUseSections.mockReturnValue({
      sections: [
        {
          id: 1,
          title: "Section title",
          description: "desc",
          isPublic: true,
          files: [file1, file2],
        },
      ],
      setSections: vi.fn(),
      sectionsToDelete: [],
      setSectionsToDelete: vi.fn(),
      updateSection: vi.fn(),
      addSection: vi.fn(),
      deleteSection: vi.fn(),
      renderFilesOnResponse: mockRenderFiles,
      updateSectionIds: vi.fn(),
    });

    mockUseStorageRefresh.mockReturnValue({
      refresh: mockRefresh,
    });

    mockUseFileDeletion.mockReturnValue({
      addFilesToDelete: mockAddFilesToDelete,
      clearFilesToDelete: vi.fn(),
      filesToDelete: [],
    });

    mockUseParams.mockReturnValue({ username: "testuser" });
    mockUseDispatch.mockReturnValue(mockDispatch);
  });

  afterEach(() => { vi.restoreAllMocks(); });

  it("renders files and delete button appears when selected", () => {
    render(<SectionFileManager sectionIndex={0} />);

    const imgs = screen.getAllByRole("img");
    expect(imgs).toHaveLength(2);

    fireEvent.click(imgs[0]);

    // Delete button appears when a file is selected
    expect(screen.getByText("Delete selected images")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Delete selected images"));
    expect(mockAddFilesToDelete).toHaveBeenCalledWith(1, ["file1"]);
  });

  it("handles file upload and dispatches on success", async () => {
    // Switch to non editing mode to allow upload
    mockUseProfile.mockReturnValue({
      isEditing: false,
      isOwnProfile: true,
      setIsEditing: vi.fn(),
    });

    // Successful backend mock
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ files: [file1] }),
    });

    render(<SectionFileManager sectionIndex={0} />);

    // Simulate file input change
    const input = screen.getByLabelText("Upload files") as HTMLInputElement;
    const file = new File(["dummy content"], "image.jpg", { type: "image/jpeg" });
    fireEvent.change(input, { target: { files: [file] } });

    const uploadBtn = await screen.findByText("Upload files");
    fireEvent.click(uploadBtn);

    // Assert upload side-effects
    await waitFor(() => {
      expect(mockRenderFiles).toHaveBeenCalledWith(1, [file1]);
      expect(mockRefresh).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalled();
    });
  });

    it("clears selected files when user clicks Cancel", async () => {
    mockUseProfile.mockReturnValue({
      isEditing: false,
      isOwnProfile: true,
      setIsEditing: vi.fn(),
    });

    render(<SectionFileManager sectionIndex={0} />);

    // Simulate file selection
    const input = screen.getByLabelText("Upload files") as HTMLInputElement;
    const file = new File(["dummy content"], "image.jpg", {
      type: "image/jpeg",
    });
    fireEvent.change(input, { target: { files: [file] } });

    const cancelButton = await screen.findByText("Cancel");
    expect(cancelButton).toBeInTheDocument();

    fireEvent.click(cancelButton);

    // Upload mode should be cancelled and reset
    await waitFor(() => {
      expect(screen.queryByText("Upload files")).not.toBeInTheDocument();
      expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
    });

    expect(screen.getByLabelText("Upload files")).toBeInTheDocument();
  });

});
