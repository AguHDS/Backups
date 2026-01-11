import type { MouseEvent } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/redux/store";
import { useLogout } from "@/features/auth";

interface Props {
  username: string;
}

export default function AccountOptions({ username }: Props) {
  const navigate = useNavigate();
  const { mutateAsync: logout } = useLogout();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      await logout();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };
  const goToProfile = () => {
    navigate({ to: "/profile/$username", params: { username } });
  };

  const goToConfig = () => {
    navigate({ to: "/settings" });
  };

  const goToAdminDashboard = () => {
    navigate({ to: "/admin-dashboard" });
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton as="div" className="mr-4 text-xl cursor-pointer text-white">
          {username}
          <ChevronDownIcon
            aria-hidden="true"
            className="relative top-[5px] -mr-1 size-5"
          />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute right-0 px-1 py-1 z-10 mt-[17px] w-56 origin-top-right rounded-md bg-[#212b3c] shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <div className="py-1">
          <MenuItem>
            {({ focus }) => (
              <button
                onClick={goToProfile}
                className={`${
                  focus ? "bg-gray-700" : ""
                } bg-[#212b3c] cursor-pointer w-full text-start text-base px-3 border-none text-white rounded`}
              >
                My Profile
              </button>
            )}
          </MenuItem>
          <div className="text-white bg-white h-[1px] w-full my-3"></div>
          <MenuItem>
            {({ focus }) => (
              <button
                onClick={goToConfig}
                className={`${
                  focus ? "bg-gray-700" : ""
                } bg-[#212b3c] cursor-pointer w-full text-start text-base px-3 border-none text-white rounded`}
              >
                Settings
              </button>
            )}
          </MenuItem>
          <div className="text-white bg-white h-[1px] w-full my-3"></div>
          {user?.role === "admin" && (
            <>
              <MenuItem>
                {({ focus }) => (
                  <button
                    onClick={goToAdminDashboard}
                    className={`${
                      focus ? "bg-gray-700" : ""
                    } bg-[#212b3c] cursor-pointer w-full text-start text-base px-3 border-none text-white rounded`}
                  >
                    Admin Dashboard
                  </button>
                )}
              </MenuItem>
              <div className="text-white bg-white h-[1px] w-full my-3"></div>
            </>
          )}
          <MenuItem>
            {({ focus }) => (
              <button
                onClick={handleLogout}
                className={`${
                  focus ? "bg-gray-700" : ""
                } bg-[#212b3c] cursor-pointer w-full text-start text-base px-3 border-none text-white rounded`}
              >
                Logout
              </button>
            )}
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}
