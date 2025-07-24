import { describe, it, expect } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { SectionsProvider, useSections } from "../../context/SectionsContext";
import { SectionWithFile } from "../../types/section";

const initialSections: SectionWithFile[] = [
  {
    id: 1,
    title: "Initial Title",
    description: "Initial Description",
    files: [],
    isPublic: true,
  },
];

const TestComponent = () => {
  const {
    sections,
    addSection,
    updateSection,
    deleteSection,
    renderFilesOnResponse,
    updateSectionIds,
    sectionsToDelete,
  } = useSections();

  return (
    <div>
      <div data-testid="section-count">{sections.length}</div>
      <div data-testid="section-title">{sections[0]?.title}</div>
      <div data-testid="section-files">{sections[0]?.files?.length || 0}</div>
      <div data-testid="deleted-sections">{sectionsToDelete.length}</div>

      <button onClick={() => addSection()}>Add</button>
      <button onClick={() => updateSection(0, "title", "Updated Title")}>
        Update Title
      </button>
      <button onClick={() => deleteSection(1)}>Delete Section</button>
      <button
        onClick={() =>
          renderFilesOnResponse(1, [
            {
              publicId: "file-1",
              url: "https://example.com",
              sectionId: "1",
              sizeInBytes: 123,
              userId: "user-1",
            },
          ])
        }
      >
        Add File
      </button>
      <button onClick={() => updateSectionIds([{ tempId: 0, newId: 99 }])}>
        Update ID
      </button>
    </div>
  );
};

describe("SectionsContext", () => {
  it("supports adding, updating, deleting sections and rendering files", () => {
    render(
      <SectionsProvider initialSections={initialSections}>
        <TestComponent />
      </SectionsProvider>
    );

    // Initial state
    expect(screen.getByTestId("section-count").textContent).toBe("1");

    fireEvent.click(screen.getByText("Update Title"));
    expect(screen.getByTestId("section-title").textContent).toBe(
      "Updated Title"
    );

    // Add new section
    fireEvent.click(screen.getByText("Add"));
    expect(screen.getByTestId("section-count").textContent).toBe("2");

    // Render files on response
    fireEvent.click(screen.getByText("Add File"));
    expect(screen.getByTestId("section-files").textContent).toBe("1");

    fireEvent.click(screen.getByText("Delete Section"));
    expect(screen.getByTestId("section-count").textContent).toBe("1");
    expect(screen.getByTestId("deleted-sections").textContent).toBe("1");
  });
});
