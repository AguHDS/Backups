/* library: headlessui */
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

//react router
import { Link } from "react-router-dom";

//redux
import { useDispatch } from "react-redux";
import { logout } from "../../../../redux/features/authThunks";

export default function AccountOptions({ username }) {
  const dispatch = useDispatch();

  const handleLogout = (e)=> {
    e.preventDefault();
    dispatch(logout());
  }

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
          <Link to="/profile">
            <MenuItem>
              <button className="bg-[#212b3c] cursor-pointer w-full text-start text-base px-3 border-none text-white rounded">
                Profile
              </button>
            </MenuItem>
          </Link>
          <div className="text-white bg-white h-[1px] w-full my-3"></div>
          <Link to="/account-settings">
            <MenuItem>
              <button className="bg-[#212b3c] cursor-pointer w-full text-start text-base px-3 border-none text-white rounded">
                Configuration
              </button>
            </MenuItem>
          </Link>
          <div className="text-white bg-white h-[1px] w-full my-3"></div>
          <Link to="/">
            <MenuItem>
              <button onClick={handleLogout} className="bg-[#212b3c] cursor-pointer w-full text-start text-base px-3 border-none text-white rounded">
                Logout
              </button>
            </MenuItem>
          </Link>
        </div>
      </MenuItems>
    </Menu>
  );
}
