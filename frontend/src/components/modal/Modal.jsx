export default function Modal({ children, onClose, livechat, profile, myfiles, users }) {
  if(onClose) return null;

  return (
    <div className="modalContainer">
      <div className="modalBasis">
        {children}
      </div>
    </div>
  );
};

/**
 * TODO
 * Podria hacer estados que cambien con las props referenciando a cada page  (profile, livechat, my files, etc) estan clickeadas, 
 * y si se clickeo actualizar el estado al clickeado (puede ser un objeto con strings de cada seccion, y desde el 
 * Modal componente retornar los componentes de las secciones)
 * 
 * TODO
 * esos componentes tienen que ser opcionales, ya que este es un modal reutilizable en todos lados
 */
 