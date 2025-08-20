import { describe, vi, it, expect, beforeEach, afterEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ModalProvider } from "@/shared/ui/Modal/ModalContext";
import { Dispatch, SetStateAction } from "react";

let usedBytesResult = 0;
let isOwnProfileResult = false;
const fetchDataMock = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useParams: () => ({ username: "testuser" }),
    useNavigate: () => vi.fn(),
  };
});

vi.mock("@/shared/ui/Modal/ModalContext", async (importOriginal) => {
  const actual = await importOriginal<
    typeof import("@/shared/ui/Modal/ModalContext")
  >();
  return {
    ...actual,
    useModalContext: () => ({
      isModalOpen: false,
      setIsModalOpen: vi.fn() as Dispatch<SetStateAction<boolean>>,
    }),
  };
});

describe("useProfileData", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ used: 123456 }),
    }) as any;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.resetModules();
    vi.restoreAllMocks();
    usedBytesResult = 0;
    isOwnProfileResult = false;
    fetchDataMock.mockReset();
  });

  it("sets usedBytes and isOwnProfile = true when user is owner", async () => {
    vi.doMock("@/shared/hooks", async (importOriginal) => {
      const actual = await importOriginal<typeof import("@/shared/hooks")>();
      return {
        ...actual,
        useFetch: () => ({
          data: {
            username: "testuser",
            id: 1,
            isOwner: true,
            role: "user",
            userProfileData: {
              bio: "Test bio",
              partner: "none",
              level: 0,
            },
            userSectionData: [],
          },
          status: 200,
          isLoading: false,
          error: null,
          fetchData: fetchDataMock,
        }),
      };
    });

    const { useProfileData } = await import("../../hooks/useProfileData");

    const HookWrapper = () => {
      const { usedBytes, isOwnProfile } = useProfileData();
      usedBytesResult = usedBytes;
      isOwnProfileResult = isOwnProfile;
      return null;
    };

    render(
      <MemoryRouter>
        <ModalProvider>
          <HookWrapper />
        </ModalProvider>
      </MemoryRouter>
    );

    // Verify API calls were made correctly
    await waitFor(() => {
      expect(fetchDataMock).toHaveBeenCalledWith(
        `http://localhost:${
          import.meta.env.VITE_BACKENDPORT
        }/api/getProfile/testuser`,
        { credentials: "include" }
      );
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `http://localhost:${
          import.meta.env.VITE_BACKENDPORT
        }/api/getStorage/testuser`
      );
    });

    // Verify hook values when user is owner
    await waitFor(() => {
      expect(usedBytesResult).toBe(123456);
      expect(isOwnProfileResult).toBe(true);
    });
  });

  it("sets isOwnProfile to false when user is not owner", async () => {
    vi.doMock("@/shared/hooks", async (importOriginal) => {
      const actual = await importOriginal<typeof import("@/shared/hooks")>();
      return {
        ...actual,
        useFetch: () => ({
          data: {
            username: "testuser",
            id: 1,
            isOwner: false,
            role: "user",
            userProfileData: {
              bio: "Test bio",
              partner: "none",
              level: 0,
            },
            userSectionData: [],
          },
          status: 200,
          isLoading: false,
          error: null,
          fetchData: fetchDataMock,
        }),
      };
    });

    const { useProfileData } = await import("../../hooks/useProfileData");

    const HookWrapper = () => {
      const { isOwnProfile } = useProfileData();
      isOwnProfileResult = isOwnProfile;
      return null;
    };

    render(
      <MemoryRouter>
        <ModalProvider>
          <HookWrapper />
        </ModalProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(isOwnProfileResult).toBe(false);
    });
  });
});
