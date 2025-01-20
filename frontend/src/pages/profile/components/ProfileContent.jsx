import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

//components
import { Button } from "../../../components";
import { Bio } from "./Bio";
import AuthFeedback from "../../login&sign/authFeedback/AuthFeedback";

//custom hooks
import useFetch from "../../../hooks/useFetch";

export const ProfileContent = ({
  isEditing,
  bio,
  title,
  description,
}) => {
  const { username } = useParams();
  const { status, isLoading, error, fetchData } = useFetch();
  const [updateData, setUpdateData] = useState({
    bio: bio,
    title: title,
    description: description,
  });
  const [sections, setSections] = useState([
    { title: title, description: description },
  ]);
  const [errorMessages, setErrorMessages] = useState([]);

  //fetch to update profile content data
  const handleUpdateProfile = async () => {
    const errors = [];

  if (!updateData.bio.trim()) {
    errors.push("Bio cannot be empty");
  }

  sections.forEach((section) => {
    if (!section.title.trim()) {
      errors.push(`Title cannot be empty`);
    }
    if (!section.description.trim()) {
      errors.push(`Description cannot be empty`);
    }
  });

  if (errors.length > 0) {
    setErrorMessages(errors);
    return;
  }
  
    await fetchData(
      `http://localhost:${
        import.meta.env.VITE_BACKENDPORT
      }/api/updateProfile/${username}`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bio: updateData.bio,
          sections,
        }),
      }
    );
  };

  useEffect(() => {
    if (!isLoading) {
      if (status === 200) {
        console.log("Profile updated successfully");
        window.location.reload();
      } else if (error) {
        console.error(error.message);
        const errorMessages = error.errors?.map((err) => err.msg) || [`${error.message}`];
        setErrorMessages(errorMessages);
      }
    }
  }, [status, error, isLoading]);

  const handleBioChange = (newBio) => {
    setUpdateData((prev) => ({
      ...prev,
      bio: newBio,
    }));
  };

  const handleChange = (field, value, index = null) => {
    if (index !== null) {
      setSections((prev) => {
        const updatedSections = [...prev];
        updatedSections[index] = {
          ...updatedSections[index],
          [field]: value,
        };
        return updatedSections;
      });
    }
  };

  return (
    <div className="w-full mr-[5px] ml-[5px] scrollbar-container flex flex-col h-full min-h-[80vh]">
      <div className="bg-[#272727] w-full max-w-full flex-1">
        <div className="p-4 space-y-4 scrollbar-container flex-1">
          <Bio
            bio={updateData.bio}
            isEditing={isEditing}
            onBioChange={handleBioChange}
          />
          {/* Sections */}
          {sections.map((section, index) => (
            <React.Fragment key={index}>
              <div className="mb-6">
                {isEditing ? (
                  <div className="flex justify-center">
                    <input
                      type="text"
                      className="w-[25%] text-center bg-[#272727] text-[#ccc] text-[18px] p-2 mb-4 border border-[#444]"
                      placeholder={`Title for Section`}
                      value={section.title}
                      onChange={(e) =>
                        handleChange("title", e.target.value, index)
                      }
                    />
                  </div>
                ) : (
                  <h2 className="text-center text-[#ccc] text-[18px] mb-2 border-t-[10px] border-l-0 border-r-0 border-b-0 pt-3 border-[#121212] border-solid w-full">
                    {title}
                  </h2>
                )}

                {isEditing ? (
                  <>
                    <textarea
                      className="w-[95%] bg-[#272727] text-[#ccc] text-[14px] p-2 mb-4 border border-[#444] resize-none"
                      rows="3"
                      placeholder="Add a new description"
                      value={section.description}
                      onChange={(e) =>
                        handleChange("description", e.target.value, index)
                      }
                    ></textarea>
                    <AuthFeedback
                      input={errorMessages}
                      status={status}
                      message={
                        errorMessages.length === 0 ? "Operation completed" : null
                      }
                    />
                  </>
                ) : (
                  <div className="flex items-center h-12 text-gray-200">
                    {description}
                  </div>
                )}
              </div>
              <div className="p-4 overflow-y-auto h-[50vh] border border-[#121212] bg-[#1e1e1e]">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {[...Array(14)].map((_, index) => (
                    <div
                      key={`imagen1-${index}`}
                      className="w-full h-[150px] bg-[#444] flex items-center justify-center text-[#ccc]"
                    >
                      imagen {index + 1}
                    </div>
                  ))}
                </div>
              </div>
            </React.Fragment>
          ))}
          <div className="flex justify-center">
            <Button
              label="Add images"
              className="my-4 p-2 text-center w-[12vw] bg-[#303030] text-[#ccc] border border-[#444] hover:bg-[#333]"
              onClick={() => alert("Processing...")}
            ></Button>
          </div>
        </div>
        {isEditing && (
          <div className="flex flex-col items-end">
            <Button
              label="Save"
              className="backupsBtn bg-[#3c3c3c] ml-auto mr-4 mb-2"
              onClick={handleUpdateProfile}
            />
          </div>
        )}
      </div>
    </div>
  );
};