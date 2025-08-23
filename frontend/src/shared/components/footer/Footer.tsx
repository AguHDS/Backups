// Footer.tsx
export const Footer = () => {
  return (
    <footer className="bg-[#0b1220] border-t border-[#1b2a44] text-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold tracking-wide mb-2">Backups</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Guarda tus archivos de forma segura y compártelos cuando quieras. Privacidad primero.
          </p>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-[#2fd07f] hover:text-[#1eb36a] transition">GitHub</a>
            <a href="#" className="text-[#2fd07f] hover:text-[#1eb36a] transition">Twitter</a>
            <a href="#" className="text-[#2fd07f] hover:text-[#1eb36a] transition">LinkedIn</a>
          </div>
        </div>

        {/* Producto */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Producto</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-[#2fd07f]">Características</a></li>
            <li><a href="#" className="hover:text-[#2fd07f]">Precios</a></li>
            <li><a href="#" className="hover:text-[#2fd07f]">Almacenamiento</a></li>
            <li><a href="#" className="hover:text-[#2fd07f]">Seguridad</a></li>
          </ul>
        </div>

        {/* Recursos */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Recursos</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-[#2fd07f]">Documentación</a></li>
            <li><a href="#" className="hover:text-[#2fd07f]">Centro de ayuda</a></li>
            <li><a href="#" className="hover:text-[#2fd07f]">Estado del servicio</a></li>
            <li><a href="#" className="hover:text-[#2fd07f]">API</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Boletín</h3>
          <p className="text-sm text-gray-400 mb-4">Actualizaciones, mejoras y consejos. Sin spam.</p>
          <form className="flex flex-col space-y-3">
            <input
              type="email"
              placeholder="tu@email.com"
              className="w-full px-3 py-2 rounded-md bg-[#0f1a2e] border border-[#1b2a44] text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2fd07f]"
            />
            <button
              type="submit"
              className="bg-[#2fd07f] hover:bg-[#1eb36a] text-[#0b1220] font-medium py-2 px-4 rounded-md text-sm transition"
            >
              Suscribirme
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-3">
            Al suscribirte aceptas nuestra{" "}
            <a href="#" className="text-[#2fd07f] hover:text-[#1eb36a]">Política de privacidad</a>.
          </p>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-[#1b2a44] mt-8 py-6 text-center text-sm text-gray-500">
        <p>© 2025 Backups. Todos los derechos reservados.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="hover:text-[#2fd07f]">Términos</a>
          <a href="#" className="hover:text-[#2fd07f]">Privacidad</a>
          <a href="#" className="hover:text-[#2fd07f]">Contacto</a>
        </div>
      </div>
    </footer>
  );
}
