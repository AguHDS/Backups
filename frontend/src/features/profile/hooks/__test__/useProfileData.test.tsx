import { describe, vi, it, expect, beforeEach, afterEach } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ModalProvider } from "../../../../shared/ui/Modal/context/ModalProvider";
import { Dispatch, SetStateAction } from "react";

const BACKEND_PORT = "3001";

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

vi.mock(
  "../../../../shared/ui/Modal/context/ModalProvider",
  async (importOriginal) => {
    const actual = await importOriginal<
      typeof import("../../../../shared/ui/Modal/context/ModalProvider")
    >();
    return {
      ...actual,
      useModalContext: () => ({
        isModalOpen: false,
        setIsModalOpen: vi.fn() as Dispatch<SetStateAction<boolean>>,
      }),
    };
  }
);

describe("useProfileData", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          used: 123456,
          limit: 1000000,
          remaining: 876544,
        }),
    }) as any;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.resetModules();
    vi.restoreAllMocks();
    isOwnProfileResult = false;
    fetchDataMock.mockReset();
  });

  it("sets isOwnProfile = true when user is owner", async () => {
    vi.doMock("../../../../shared/hooks", async (importOriginal) => {
      const actual = await importOriginal<
        typeof import("../../../../shared/hooks")
      >();
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

    // Verify API calls were made correctly - usando la constante BACKEND_PORT
    await waitFor(() => {
      expect(fetchDataMock).toHaveBeenCalledWith(
        `http://localhost:${BACKEND_PORT}/api/getProfile/testuser`,
        { credentials: "include" }
      );
    });

    // Verify hook values when user is owner
    await waitFor(() => {
      expect(isOwnProfileResult).toBe(true);
    });
  });

  it("sets isOwnProfile to false when user is not owner", async () => {
    vi.doMock("../../../../shared/hooks", async (importOriginal) => {
      const actual = await importOriginal<
        typeof import("../../../../shared/hooks")
      >();
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

  it("navigates to NotFound when status is 404", async () => {
    const mockNavigate = vi.fn();

    vi.doMock("react-router-dom", async (importOriginal) => {
      const actual = await importOriginal<typeof import("react-router-dom")>();
      return {
        ...actual,
        useParams: () => ({ username: "testuser" }),
        useNavigate: () => mockNavigate,
      };
    });

    vi.doMock("../../../../shared/hooks", async (importOriginal) => {
      const actual = await importOriginal<
        typeof import("../../../../shared/hooks")
      >();
      return {
        ...actual,
        useFetch: () => ({
          data: null,
          status: 404,
          isLoading: false,
          error: "Not found",
          fetchData: fetchDataMock,
        }),
      };
    });

    const { useProfileData } = await import("../../hooks/useProfileData");

    const HookWrapper = () => {
      useProfileData();
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
      expect(mockNavigate).toHaveBeenCalledWith("/NotFound");
    });
  });
});

describe("useStorageData", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          used: 123456,
          limit: 1000000,
          remaining: 876544,
        }),
    }) as any;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it("fetches and returns storage data correctly", async () => {
    const { useStorageData } = await import("../../hooks/useStorageData");

    let storageResult: {
      usedBytes: number;
      limitBytes: number;
      remainingBytes: number;
    } | null = null;

    const HookWrapper = () => {
      const storage = useStorageData();
      storageResult = storage;
      return null;
    };

    render(
      <MemoryRouter>
        <HookWrapper />
      </MemoryRouter>
    );

    // Verify fetch was called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `http://localhost:${BACKEND_PORT}/api/getStorage/testuser`
      );
    });

    // Verify storage data
    await waitFor(() => {
      expect(storageResult).toEqual({
        usedBytes: 123456,
        limitBytes: 1000000,
        remainingBytes: 876544,
      });
    });
  });

  it("handles fetch error gracefully", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: "Failed to fetch" }),
    }) as any;

    const { useStorageData } = await import("../../hooks/useStorageData");

    let storageResult: {
      usedBytes: number;
      limitBytes: number;
      remainingBytes: number;
    } | null = null;

    const HookWrapper = () => {
      const storage = useStorageData();
      storageResult = storage;
      return null;
    };

    render(
      <MemoryRouter>
        <HookWrapper />
      </MemoryRouter>
    );

    // Should return default values on error
    await waitFor(() => {
      expect(storageResult).toEqual({
        usedBytes: 0,
        limitBytes: 0,
        remainingBytes: 0,
      });
    });
  });

  it("refetches when refreshTrigger changes", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          used: 123456,
          limit: 1000000,
          remaining: 876544,
        }),
    });
    global.fetch = fetchMock;

    const { useStorageData } = await import("../../hooks/useStorageData");

    const HookWrapper = ({ refreshTrigger }: { refreshTrigger?: boolean }) => {
      useStorageData(refreshTrigger);
      return null;
    };

    const { rerender } = render(
      <MemoryRouter>
        <HookWrapper refreshTrigger={false} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });

    // Change refreshTrigger to trigger refetch
    rerender(
      <MemoryRouter>
        <HookWrapper refreshTrigger={true} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });

  it("returns default values when username is undefined", async () => {
    // Mock useParams para devolver username undefined
    vi.doMock("react-router-dom", async (importOriginal) => {
      const actual = await importOriginal<typeof import("react-router-dom")>();
      return {
        ...actual,
        useParams: () => ({ username: undefined }),
      };
    });

    const { useStorageData } = await import("../../hooks/useStorageData");

    let storageResult: {
      usedBytes: number;
      limitBytes: number;
      remainingBytes: number;
    } | null = null;

    const HookWrapper = () => {
      const storage = useStorageData();
      storageResult = storage;
      return null;
    };

    render(
      <MemoryRouter>
        <HookWrapper />
      </MemoryRouter>
    );

    // Should not call fetch and return default values
    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
      expect(storageResult).toEqual({
        usedBytes: 0,
        limitBytes: 0,
        remainingBytes: 0,
      });
    });
  });
});

// Test de integración opcional
describe("Profile integration", () => {
  it("combines profile and storage data", async () => {
    // Mock useFetch para profile
    vi.doMock("../../../../shared/hooks", () => ({
      useFetch: () => ({
        data: {
          username: "testuser",
          id: 1,
          isOwner: true,
          role: "user",
          userProfileData: {
            bio: "Test bio",
            level: 0,
          },
          userSectionData: [],
        },
        status: 200,
        isLoading: false,
        error: null,
        fetchData: vi.fn(),
      }),
    }));

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          used: 123456,
          limit: 1000000,
          remaining: 876544,
        }),
    });

    const { useProfileData } = await import("../../hooks/useProfileData");
    const { useStorageData } = await import("../../hooks/useStorageData");

    let profileResult: any = null;
    let storageResult: any = null;

    const HookWrapper = () => {
      const profile = useProfileData();
      const storage = useStorageData();
      profileResult = profile;
      storageResult = storage;
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
      expect(profileResult.isOwnProfile).toBe(true);
      expect(storageResult.usedBytes).toBe(123456);
    });
  });
});
