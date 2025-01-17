import { Button } from "../../../components";

export const ProfileContent = ({ isEditing, isOwnProfile, bio, title, description, images, onUploadImage, onDescriptionChange }) => {
  return (
    <div className="w-full mr-[5px] ml-[5px] scrollbar-container">
      <div className="bg-[#272727] w-full max-w-full max-h-max">
        {/* bio */}
        <div className="p-4 space-y-4 scrollbar-container">
          <div className="flex items-center h-12 text-gray-200">
            {bio}
          </div>
          {/* Sección 1 */}
          <h2 className="text-center text-[#ccc] text-[18px] mb-2 border-t-[10px] border-l-0 border-r-0 border-b-0 pt-3 border-[#121212] border-solid w-full">
            Sección 1
          </h2>
          {isOwnProfile && isEditing && (
            <textarea
              className="w-[95%] flex justify-center mx-auto bg-[#272727] text-[#ccc] text-[14px] p-2 mb-4 border border-[#444] resize-none"
              rows="3"
              placeholder="Añade una breve descripción para la Sección 1..."
            ></textarea>
          )}
          <div className="p-4 overflow-y-auto max-h-[400px] border border-[#121212] bg-[#1e1e1e]">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {[...Array(12)].map((_, index) => (
                <div
                  key={`imagen1-${index}`}
                  className="w-full h-[150px] bg-[#444] flex items-center justify-center text-[#ccc]"
                >
                  imagen {index + 1}
                </div>
              ))}
            </div>
          </div>
          {isOwnProfile && (
            <Button
              label="Subir Imagen a Sección 1"
              className="mx-auto flex justify-center mt-2 p-2 bg-[#272727] text-[#ccc] border border-[#444] hover:bg-[#333] transition"
              onClick={() => alert("Subir imagen a Sección 1")}
            ></Button>
          )}
        </div>
        {isOwnProfile && (
          <Button
            label="Añadir nueva sección"
            className="my-4 p-2 w-full bg-[#272727] text-[#ccc] border border-[#444] hover:bg-[#333]"
            onClick={() => alert("Añadir nueva sección")}
          ></Button>
        )}
      </div>
    </div>
  );
};
