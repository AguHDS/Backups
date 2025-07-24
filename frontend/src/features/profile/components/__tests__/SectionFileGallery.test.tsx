import { render, screen, fireEvent } from "@testing-library/react";
import { SectionFileGallery } from "../SectionFileGallery";
import type { UploadedFile } from "../../types/section";

describe("SectionFileGallery", () => {
  // Mock file data with 2 valid files and 1 invalid (missing publicId)
  const mockFiles: UploadedFile[] = [
    {
      publicId: "file1",
      url: "https://example.com/file1.jpg",
      sectionId: "section-1",
      sizeInBytes: 1024,
      userId: 42,
    },
    {
      publicId: "file2",
      url: "https://example.com/file2.jpg",
      sectionId: "section-1",
      sizeInBytes: 2048,
      userId: 42,
    },
    {
      publicId: null as unknown as string,
      url: "https://example.com/invalid.jpg",
      sectionId: "section-1",
      sizeInBytes: 0,
      userId: 42,
    },
  ];

  it("renders only files with a valid publicId", () => {
    render(<SectionFileGallery uploadedFiles={mockFiles} sectionId="abc" />);

    // Only valid images should be rendered (2 out of 3)
    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute("src", "https://example.com/file1.jpg");
    expect(images[1]).toHaveAttribute("src", "https://example.com/file2.jpg");
  });

  it("show message if there isn't valid files", () => {
    render(<SectionFileGallery uploadedFiles={[]} sectionId="abc" />);
    expect(screen.getByText(/no files uploaded/i)).toBeInTheDocument();
  });

  it("don't allow selection if isEditing is false", () => {
    const toggleFileSelection = vi.fn();
    render(
      <SectionFileGallery
        uploadedFiles={mockFiles}
        sectionId="abc"
        isEditing={false}
        toggleFileSelection={toggleFileSelection}
      />
    );
    const file = screen.getAllByRole("img")[0];
    fireEvent.click(file);
    expect(toggleFileSelection).not.toHaveBeenCalled();
  });

  it("allow selection of files if isEditing is true", () => {
    const toggleFileSelection = vi.fn();
    render(
      <SectionFileGallery
        uploadedFiles={mockFiles}
        sectionId="abc"
        isEditing={true}
        toggleFileSelection={toggleFileSelection}
      />
    );
    // Clicking an image should toggle its selection
    const file = screen.getAllByRole("img")[0];
    fireEvent.click(file);
    expect(toggleFileSelection).toHaveBeenCalledWith("file1");
  });

  it("show checkbox if file is selected", () => {
    render(
      <SectionFileGallery
        uploadedFiles={mockFiles}
        sectionId="abc"
        isEditing={true}
        selectedFileIds={new Set(["file1"])}
      />
    );

    // Checkboxes should be visible and reflect selected state
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(2);
    expect(checkboxes[0]).toBeChecked(); // file 1 is selected
    expect(checkboxes[1]).not.toBeChecked(); // file 2 is not
  });

  it("supports multi selection", () => {
    const toggleFileSelection = vi.fn();
    render(
      <SectionFileGallery
        uploadedFiles={mockFiles}
        sectionId="abc"
        isEditing={true}
        toggleFileSelection={toggleFileSelection}
      />
    );
    
    // Simulate normal click + shift+click for multi-select
    const images = screen.getAllByRole("img");
    fireEvent.click(images[0]); // click normal
    fireEvent.click(images[1], { shiftKey: true }); // shift+click

    // both files should be selected
    expect(toggleFileSelection).toHaveBeenCalledWith("file1");
    expect(toggleFileSelection).toHaveBeenCalledWith("file2");
  });
});
