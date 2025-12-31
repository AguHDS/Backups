import { useEffect } from "react";
import { useAdminDashboard } from "../context";
import {
  useGetUserSections,
  useDeleteUserSections,
} from "../hooks/useAdminMutations";

export const ManageSections: React.FC = () => {
  const {
    selectedUser,
    userSections,
    setUserSections,
    selectedSectionIds,
    toggleSectionSelection,
    clearSectionSelection,
  } = useAdminDashboard();

  const { data: sectionsData, isLoading } = useGetUserSections(
    selectedUser?.id || null
  );
  const deleteSecMutation = useDeleteUserSections();

  useEffect(() => {
    if (sectionsData?.sections) {
      setUserSections(sectionsData.sections);
    } else {
      setUserSections([]);
    }
    clearSectionSelection();
  }, [sectionsData, setUserSections, clearSectionSelection]);

  const isDisabled = !selectedUser;

  const handleDeleteSections = () => {
    if (!selectedUser || selectedSectionIds.length === 0) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedSectionIds.length} section(s)?`
    );

    if (!confirmDelete) return;

    deleteSecMutation.mutate(
      {
        userId: selectedUser.id,
        sectionIds: selectedSectionIds,
      },
      {
        onSuccess: (response) => {
          alert(
            `Success: ${response.message}. Deleted ${response.deletedCount} section(s)`
          );
          clearSectionSelection();
        },
        onError: (error) => {
          alert(`Error: ${error.message}`);
        },
      }
    );
  };

  return (
    <div className="bg-[#232d42] rounded-lg border border-[#3a4a68] p-6">
      <h3 className="text-lg font-semibold mb-4 text-white">
        Manage User's Sections
      </h3>

      {!selectedUser && (
        <p className="text-sm text-gray-400 mb-4">
          Select a user to manage their sections
        </p>
      )}

      {selectedUser && isLoading && (
        <p className="text-sm text-gray-400 mb-4">Loading sections...</p>
      )}

      {selectedUser && !isLoading && userSections.length === 0 && (
        <p className="text-sm text-gray-400 mb-4">
          This user has no sections
        </p>
      )}

      {selectedUser && !isLoading && userSections.length > 0 && (
        <>
          <div className="mb-4 space-y-2 max-h-64 overflow-y-auto">
            {userSections.map((section) => (
              <div
                key={section.id}
                className={`p-3 border rounded-md cursor-pointer transition-colors ${
                  selectedSectionIds.includes(section.id)
                    ? "border-red-500 bg-red-900/20"
                    : "border-[#3a4a68] hover:border-[#4a5a88] bg-[#1a2332]"
                }`}
                onClick={() => toggleSectionSelection(section.id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-white">{section.title}</p>
                    {section.description && (
                      <p className="text-sm text-gray-400 mt-1">
                        {section.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        section.isPublic
                          ? "bg-green-900/50 text-green-300"
                          : "bg-gray-700/50 text-gray-300"
                      }`}
                    >
                      {section.isPublic ? "Public" : "Private"}
                    </span>
                    {selectedSectionIds.includes(section.id) && (
                      <span className="text-red-400">✓</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDeleteSections}
              disabled={
                isDisabled ||
                selectedSectionIds.length === 0 ||
                deleteSecMutation.isPending
              }
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-[#2a3a58] disabled:cursor-not-allowed transition-colors font-medium"
            >
              {deleteSecMutation.isPending
                ? "Deleting..."
                : `Delete Selected (${selectedSectionIds.length})`}
            </button>

            {selectedSectionIds.length > 0 && (
              <button
                onClick={clearSectionSelection}
                className="px-4 py-2 bg-[#1a2332] text-gray-300 border border-[#3a4a68] rounded-md hover:bg-[#0e172a] transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
