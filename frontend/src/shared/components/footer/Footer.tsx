export const Footer = () => {
  return (
    <footer className="bg-[#0b1220] mt-10 border-t border-[#1b2a44] text-gray-200">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        <div>
          <h2 className="text-xl font-bold tracking-wide mb-2">Backups</h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            Store your files securely and share them whenever you want. Privacy first.
          </p>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-[#2fd07f] hover:text-[#1eb36a] transition">GitHub</a>
            <a href="#" className="text-[#2fd07f] hover:text-[#1eb36a] transition">Twitter</a>
            <a href="#" className="text-[#2fd07f] hover:text-[#1eb36a] transition">LinkedIn</a>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Product</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-[#2fd07f]">Features</a></li>
            <li><a href="#" className="hover:text-[#2fd07f]">Pricing</a></li>
            <li><a href="#" className="hover:text-[#2fd07f]">Storage</a></li>
            <li><a href="#" className="hover:text-[#2fd07f]">Security</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Resources</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-[#2fd07f]">Documentation</a></li>
            <li><a href="#" className="hover:text-[#2fd07f]">Help Center</a></li>
            <li><a href="#" className="hover:text-[#2fd07f]">Service Status</a></li>
            <li><a href="#" className="hover:text-[#2fd07f]">API</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Newsletter</h3>
          <p className="text-sm text-gray-400 mb-4">Updates, improvements, and tips. No spam.</p>
          <form className="flex flex-col space-y-3">
            <input
              type="email"
              placeholder="your@email.com"
              className="w-full px-3 py-2 rounded-md bg-[#0f1a2e] border border-[#1b2a44] text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2fd07f]"
            />
            <button
              type="submit"
              className="bg-[#2fd07f] hover:bg-[#1eb36a] text-[#0b1220] font-medium py-2 px-4 rounded-md text-sm transition"
            >
              Subscribe
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-3">
            By subscribing, you agree to our{" "}
            <a href="#" className="text-[#2fd07f] hover:text-[#1eb36a]">Privacy Policy</a>.
          </p>
        </div>
      </div>

      <div className="border-t border-[#1b2a44] py-6 text-center text-sm text-gray-500">
        <p>© 2025 Backups. All rights reserved.</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="hover:text-[#2fd07f]">Terms</a>
          <a href="#" className="hover:text-[#2fd07f]">Privacy</a>
          <a href="#" className="hover:text-[#2fd07f]">Contact</a>
        </div>
      </div>
    </footer>
  );
}
