/* library used: headlessui */
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { createRef } from "react";

//redux
import { useSelector } from "react-redux";

export default function AccountOptions() {
  const { userData } = useSelector((state) => state.auth);

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton as="div" className="mr-4 text-xl cursor-pointer text-white">
          {userData.name}
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
            <button className="bg-[#212b3c] cursor-pointer w-full text-start text-base px-3 border-none text-white rounded">
              Configuration
            </button>
          </MenuItem>
          <div className="text-white bg-white h-[1px] w-full my-3"></div>
          <MenuItem>
            <button
              className="bg-[#212b3c] cursor-pointer w-full text-start text-base px-3 border-none text-white rounded"
            >
              Logout
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}

/* hacer tareas que digan sobre profile: 
tiene que ser accedido mediante un ingreso de ruta por link element desde el boton Profile en navbar o clickeo de imagen.
y para trabajar con hijos: la page profile va a renderizar hijos como la biografia, las imagenes, el contenido a la izquierda, etc 
hacer lo mismo o algo parecido con configuracion, pensar qué cosa deberia y que cosa no debería ser un Hijo */













/* const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => { future handle logout when i already have next and use it with its useRouter
    try {
      // Hacer la solicitud al backend para cerrar sesión
      const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include', // Incluir las cookies si es necesario
      });
      if (response.ok) {
        // Despachar la acción de logout para borrar el token de Redux
        dispatch(logout());
        
        // Redirigir al usuario después de que la sesión se cierre
        router.push('/login'); // O cualquier otra página después de cerrar sesión
      } else {
        console.error('Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Error de red', error);
    }
  }; */
