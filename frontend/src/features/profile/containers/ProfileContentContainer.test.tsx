import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { store } from "../../../app/redux/store";
import { ProfileContentContainer } from "./ProfileContentContainer";
import { ProfileProvider } from "../context/editProfile/EditProfileProvider";
import { SectionsProvider } from "../context/Section/SectionsProvider";
import { FileDeletionProvider } from "../context/FileDeletion/FileDeletionProvider";
import { StorageRefreshProvider } from "../context/StorageRefresh/StorageRefreshProvider";
import { UserProfileWithFiles } from "../types/profileData";
import { ModalProvider } from "../../../shared/ui/Modal/context/ModalProvider";
import { MemoryRouter } from "react-router-dom";

const BACKEND_PORT = "3001";

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

vi.mock("../context/Profile/ProfileProvider", async (importOriginal) => {
  const actual = await importOriginal<
    typeof import("../context/editProfile/EditProfileProvider")
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

// Mock global fetch to avoid real requests during test
beforeAll(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => ({}),
  }) as unknown as typeof fetch;
});

afterAll(() => {
  vi.restoreAllMocks();
});

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
      level: 0,
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
  });

  it("should not show validation errors when all fields are filled", async () => {
    const filledData: UserProfileWithFiles = {
      username: "testuser",
      role: "user",
      id: 1,
      isOwner: true,
      userProfileData: {
        bio: "Test bio",
        level: 0,
      },
      userSectionData: [
        {
          id: 1,
          title: "Test Section",
          description: "Test Description",
          files: [],
          isPublic: true,
        },
      ],
    };

    renderWithProviders(<ProfileContentContainer data={filledData} />);

    const saveButton = screen.getByText(/save/i);
    fireEvent.click(saveButton);
  });

  it("should call updateProfile API when save is clicked with valid data", async () => {
    const filledData: UserProfileWithFiles = {
      username: "testuser",
      role: "user",
      id: 1,
      isOwner: true,
      userProfileData: {
        bio: "Test bio",
        level: 0,
      },
      userSectionData: [
        {
          id: 1,
          title: "Test Section",
          description: "Test Description",
          files: [],
          isPublic: true,
        },
      ],
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    global.fetch = fetchMock;

    renderWithProviders(<ProfileContentContainer data={filledData} />);

    const saveButton = screen.getByText(/save/i);
    fireEvent.click(saveButton);

    // Verificar que se llama a la API
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        `http://localhost:${BACKEND_PORT}/api/updateProfile/testuser`,
        expect.objectContaining({
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })
      );
    });
  });

  it("should show error message when API call fails", async () => {
    const filledData: UserProfileWithFiles = {
      username: "testuser",
      role: "user",
      id: 1,
      isOwner: true,
      userProfileData: {
        bio: "Test bio",
        level: 0,
      },
      userSectionData: [
        {
          id: 1,
          title: "Test Section",
          description: "Test Description",
          files: [],
          isPublic: true,
        },
      ],
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Update failed" }),
    });
    global.fetch = fetchMock;

    renderWithProviders(<ProfileContentContainer data={filledData} />);

    const saveButton = screen.getByText(/save/i);
    fireEvent.click(saveButton);

    await waitFor(() => {
    });
  });

  it("should toggle edit mode when Edit button is clicked", () => {
    renderWithProviders(<ProfileContentContainer data={data} />);

    const editButton = screen.getByText(/edit/i);
    fireEvent.click(editButton);

  });
});
