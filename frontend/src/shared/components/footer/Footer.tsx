import {
  HiOutlineMail,
  HiOutlineChatAlt2,
  HiOutlineDocumentText,
  HiOutlineInformationCircle,
  HiOutlineLockClosed,
  HiOutlineDocument,
  HiOutlineBookOpen,
} from "react-icons/hi";
import { useModalContext, Modal, TermsAndConditions } from "@/shared";

export const Footer = () => {
  const { isModalOpen, setIsModalOpen } = useModalContext();

  return (
    <>
      {isModalOpen && (
        <Modal>
          <TermsAndConditions onUnderstand={() => setIsModalOpen(false)} />
        </Modal>
      )}

      <footer
        className="bg-[#0b1220] border-t border-[#1b2a44] text-gray-200"
        style={{ boxShadow: "0px -12px 16px -7px rgb(25 36 59)" }}
      >
        <div className="max-w-7xl mx-auto pt-10 px-6 flex flex-col md:flex-row justify-center items-start gap-48 text-left">
          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <ul className="space-y-2 pl-0 text-sm list-inside">
              <li className="flex items-center space-x-3">
                <HiOutlineChatAlt2 className="text-[#2fd07f] w-5 h-5" />
                <a
                  href="https://wa.me/1234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#2fd07f]"
                >
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <HiOutlineMail className="text-[#2fd07f] w-5 h-5" />
                <a
                  href="mailto:contact@backups.com"
                  className="hover:text-[#2fd07f]"
                >
                  Email
                </a>
              </li>
            </ul>
          </div>

          {/* Backups Section (FAQ & About) */}
          <div>
            <h2 className="text-xl font-bold tracking-wide mb-2">Backups</h2>
            <ul className="space-y-2 pl-0 text-sm list-inside">
              <li className="flex items-center space-x-3">
                <HiOutlineInformationCircle className="text-[#2fd07f] w-5 h-5" />
                <a href="#" className="hover:text-[#2fd07f]">
                  About
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <HiOutlineBookOpen className="text-[#2fd07f] w-5 h-5" />
                <a href="#" className="hover:text-[#2fd07f]">
                  User Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 pl-0 text-sm list-inside">
              <li className="flex items-center space-x-3">
                <HiOutlineLockClosed className="text-[#2fd07f] w-5 h-5" />
                <a href="/privacy-policy" className="hover:text-[#2fd07f]">
                  Privacy Policy
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <HiOutlineDocument className="text-[#2fd07f] w-5 h-5" />
                <a
                  className="hover:text-[#2fd07f] cursor-pointer"
                  onClick={() => setIsModalOpen(true)}
                >
                  Terms & Conditions
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <HiOutlineDocumentText className="text-[#2fd07f] w-5 h-5" />
                <a href="/cookie-policy" className="hover:text-[#2fd07f]">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#1b2a44] pt-3 text-center text-sm text-gray-500">
          <p>© 2025 Backups. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
};
