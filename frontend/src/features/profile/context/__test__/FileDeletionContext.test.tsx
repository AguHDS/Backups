import { render, screen, fireEvent } from "@testing-library/react";
import { FileDeletionProvider, useFileDeletion } from "../FileDeletionContext";

const TestComponent = () => {
  const { filesToDelete, addFilesToDelete, clearFilesToDelete } =
    useFileDeletion();

  return (
    <div>
      <button onClick={() => addFilesToDelete(1, ["file1", "file2"])}>
        Add Files
      </button>
      <button onClick={() => addFilesToDelete(1, ["file2", "file3"])}>
        Add More Files
      </button>
      <button onClick={() => clearFilesToDelete()}>Clear</button>
      <div data-testid="files">
        {filesToDelete.map((entry) => (
          <div key={entry.sectionId} data-testid="entry">
            <div>Section: {entry.sectionId}</div>
            <div>Files: {entry.publicIds.join(",")}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

describe("FileDeletionContext", () => {
  it("adds new files for a section correctly", () => {
    render(
      <FileDeletionProvider>
        <TestComponent />
      </FileDeletionProvider>
    );

    // Add initial files for section (1)
    fireEvent.click(screen.getByText("Add Files"));

    // Check that the section appears with the correct files
    expect(screen.getByTestId("files").textContent).toContain("Section: 1");
    expect(screen.getByTestId("files").textContent).toContain("file1,file2");
  });

  it("merges files without duplicates for same section", () => {
    render(
      <FileDeletionProvider>
        <TestComponent />
      </FileDeletionProvider>
    );

    // Add initial files
    fireEvent.click(screen.getByText("Add Files"));
    // Add more files including a duplicate
    fireEvent.click(screen.getByText("Add More Files"));

    // Should merge and deduplicate: file1, file2, file3
    expect(screen.getByTestId("files").textContent).toContain("file1,file2,file3");
  });

  it("clears all files to delete", () => {
    render(
      <FileDeletionProvider>
        <TestComponent />
      </FileDeletionProvider>
    );

    fireEvent.click(screen.getByText("Add Files"));
    fireEvent.click(screen.getByText("Clear"));

    // No file should remain
    expect(screen.queryByTestId("entry")).not.toBeInTheDocument();
  });
});
