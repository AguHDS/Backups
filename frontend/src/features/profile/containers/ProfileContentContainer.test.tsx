import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "@/app/redux/store";
import { ProfileContentContainer } from "./ProfileContentContainer";
import { ProfileProvider } from "../context/ProfileContext";
import { SectionsProvider } from "../context/SectionsContext";
import { FileDeletionProvider } from "../context/FileDeletionContext";
import { StorageRefreshProvider } from "../context/StorageRefreshContext";
import { UserProfileWithFiles } from "../types/profileData";
import { ModalProvider } from "@/shared/ui/Modal/ModalContext";
import { MemoryRouter } from "react-router-dom";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );
  return {
    ...actual,
    useParams: () => ({ username: "testuser" }),
    useNavigate: () => vi.fn(),
  };
});

vi.mock("../context/ProfileContext", async (importOriginal) => {
  const actual = await importOriginal<
    typeof import("../context/ProfileContext")
  >();
  return {
    ...actual,
    useProfile: () => ({
      isEditing: true,
      setIsEditing: vi.fn(),
      isOwnProfile: true,
    }),
  };
});

//Mock global fetch to avoid real requests during test
beforeAll(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({}),
  }) as unknown as typeof fetch;
});

afterAll(() => { vi.restoreAllMocks() });

describe("ProfileContentContainer", () => {
  const initialSections = [
    {
      id: 1,
      title: "",
      description: "",
      files: [],
      isPublic: true,
    },
  ];

  const data: UserProfileWithFiles = {
    username: "testuser",
    role: "user",
    id: 1,
    isOwner: true,
    userProfileData: {
      bio: "",
      friends: 0,
      partner: "-",
    },
    userSectionData: initialSections,
  };

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <Provider store={store}>
        <MemoryRouter>
          <ModalProvider>
            <ProfileProvider isOwnProfile={true}>
              <SectionsProvider initialSections={initialSections}>
                <FileDeletionProvider>
                  <StorageRefreshProvider>{ui}</StorageRefreshProvider>
                </FileDeletionProvider>
              </SectionsProvider>
            </ProfileProvider>
          </ModalProvider>
        </MemoryRouter>
      </Provider>
    );
  };

  it("should build validation errors when title or sections are empty and user clicks Save", async () => {
    renderWithProviders(<ProfileContentContainer data={data} />);

    const saveButton = screen.getByText(/save/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/bio cannot be empty/i)).toBeInTheDocument();
      expect(screen.getByText(/section 1 title is empty/i)).toBeInTheDocument();
      expect(
        screen.getByText(/section 1 description is empty/i)
      ).toBeInTheDocument();
    });
  });
});
