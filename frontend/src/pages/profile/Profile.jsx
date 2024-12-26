import { Link } from "react-router-dom";

//redux
import { useSelector } from "react-redux";

//assets
import images from "../../assets/images.js";

export const Profile = () => {
  const { userData } = useSelector((state) => state.auth);

  return (
    <div className="mx-auto flex justify-center mt-5">
      <div className="w-[80vw] max-w-full">
        {/* header */}
        <div className="w-full">
          <h1 className="bg-[#222] border font-serif border-t-[#222] border-b-[#585858] border-l-[#272727] border-r-[#272727] text-[#e0e0e0] font-verdana font-bold text-sm m-0 p-[5px_9px] text-left flex items-center justify-between">
            <span className="flex ml-[50px] relative top-[2px] text-base">
              Ag's profile
            </span>
            <Link
              to="/profile-settings"
              className="float-right font-verdana text-xs relative top-[2px] mr-2 font-normal leading-[1em] text-blue-500 hover:underline"
            >
              Profile settings
            </Link>
          </h1>
        </div>

        {/* content */}
        <div className="p-[8px] bg-[#121212] border-[#272727] border-solid border-r border-b text-[#e0e0e0]">
          <div className="flex flex-col md:flex-row w-full">
            {/* left part */}
            <div className="bg-[#272727] p-2 flex-shrink-0 w-full md:w-[225px]">
              <div className="block text-center">
                <img
                  className="max-h-[350px] max-w-full"
                  src={images.testImage}
                  alt="Profile"
                />
              </div>
              <div className="flex justify-center items-center mt-2">
                <Link
                  to="/home"
                  title="Share GB"
                  className="h-[30px] mx-[2px] w-[45px] flex items-center justify-center"
                >
                  <img
                    src={images.giftIcon}
                    className="h-6 w-7 object-contain"
                    alt="Gift"
                  />
                </Link>
                <Link
                  to="/"
                  title="Send message"
                  className="h-[30px] mx-[2px] w-[45px] flex items-center justify-center"
                >
                  <img
                    src={images.msgIcon}
                    className="h-6 w-7 object-contain"
                    alt="Message"
                  />
                </Link>
                <span
                  title="Add friend"
                  className="h-[30px] mx-[2px] w-[45px] flex items-center justify-center"
                >
                  <img
                    src={images.addFriend}
                    className="h-6 w-7 object-contain"
                    alt="Add Friend"
                  />
                </span>
              </div>
              <ul className="mt-5 border-t border-solid border-[#141414] p-0 list-none">
                <li className="bg-[#121212] p-1 flex justify-between">
                  <span>status</span>
                  <span className="text-gray-400">offline</span>
                </li>
                <li className="bg-[#121212] p-1 flex justify-between">
                  <span>role</span>
                  <span className="text-gray-400">user</span>
                </li>
                <li className="bg-[#121212] p-1 flex justify-between">
                  <span>friends</span>
                  <span>4</span>
                </li>
                <li className="bg-[#121212] p-1 flex justify-between">
                  <span>max. space</span>
                  <span className="text-green-400">6 GB</span>
                </li>
              </ul>
              <h3 className="text-center my-5">Space used</h3>
              <img
                src={images.graph}
                className="w-[100px] flex justify-center mx-auto"
                alt="Graph"
              />
              <div className="mt-4 flex flex-col w-full">
                <div className="flex my-[3px] justify-between items-center w-full">
                  <span className="text-cyan-300 text-ls px-4">
                    space available
                  </span>
                  <span className="text-cyan-300 text-ls px-4 text-sm">
                    2 GB
                  </span>
                </div>
                <div className="flex my-[3px] justify-between items-center w-full">
                  <span className="text-red-500 text-ls px-4">space used</span>
                  <span className="text-red-500 text-ls px-4 text-sm">
                    3 GB
                  </span>
                </div>
                <div className="flex my-[3px] justify-between items-center w-full">
                  <span className="text-yellow-500 text-ls px-4">
                    space shared
                  </span>
                  <span className="text-yellow-500 text-ls px-4 text-sm">
                    1 GB
                  </span>
                </div>
              </div>
            </div>

            {/* right side */}
            <div className="w-full mr-[5px] ml-[5px] scrollbar-container">
              <div className="bg-[#272727] w-full max-w-full max-h-max">
                <h1 className="mb-1 flex relative top-2 justify-center my-0 p-1 font-light">
                  Public Backups
                </h1>
                {/* Contenedor de secciones */}
                <div className="p-4 space-y-4 scrollbar-container">
                  {/* Sección 1 */}
                  <h2 className="text-center text-[#ccc] text-[18px] mb-2 border-t-[10px] border-l-0 border-r-0 border-b-0 pt-3 border-[#121212] border-solid w-full">
                    Sección 1
                  </h2>
                  <textarea
                    className="w-[95%] flex justify-center mx-auto bg-[#272727] text-[#ccc] text-[14px] p-2 mb-4 border border-[#444] resize-none"
                    rows="3"
                    placeholder="Añade una breve descripción para la Sección 1..."
                  ></textarea>
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
                  <button
                    className="mt-2 p-2 w-full bg-[#272727] text-[#ccc] border border-[#444] hover:bg-[#333] transition"
                    onClick={() => alert("Subir imagen a Sección 1")}
                  >
                    Subir Imagen a Sección 1
                  </button>
                  {/* Sección 2 */}
                  <h2 className="text-center text-[#ccc] text-[18px] mb-2 border-t-[10px] border-l-0 border-r-0 border-b-0 pt-3 border-[#121212] border-solid w-full">
                    Sección 2
                  </h2>
                  <textarea
                    className="w-[95%] flex justify-center mx-auto bg-[#272727] text-[#ccc] text-[14px] p-2 mb-4 border border-[#444] resize-none"
                    rows="3"
                    placeholder="Añade una breve descripción para la Sección 2..."
                  ></textarea>
                  <div className="p-4 overflow-y-auto max-h-[400px] border border-[#121212] bg-[#1e1e1e]">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                      {[...Array(6)].map((_, index) => (
                        <div
                          key={`imagen1-${index}`}
                          className="w-full h-[150px] bg-[#444] flex items-center justify-center text-[#ccc]"
                        >
                          imagen {index + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button
                    className="mt-2 p-2 w-full bg-[#272727] text-[#ccc] border border-[#444] hover:bg-[#333] transition"
                    onClick={() => alert("Subir imagen a Sección 2")}
                  >
                    Subir Imagen a Sección 2
                  </button>
                </div>
                {/* Botón para añadir nueva sección */}
                <button
                  className="mt-4 p-2 w-full bg-[#272727] text-[#ccc] border border-[#444] hover:bg-[#333] transition"
                  onClick={() => alert("Añadir nueva sección")}
                >
                  Añadir nueva sección
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
