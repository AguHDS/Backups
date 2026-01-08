import { useState } from "react";
import {
  HiOutlineMail,
  HiOutlineChatAlt2,
  HiOutlineDocumentText,
  HiOutlineInformationCircle,
  HiOutlineDocument,
  HiOutlineBookOpen,
} from "react-icons/hi";
import { useModalContext, Modal } from "@/shared";
import { TermsAndConditions } from "@/shared";
import { UserGuide } from "./components/UserGuide";
import { CookiePolicy } from "./components/CookiePolicy";
import { About } from "./components/About";

export const Footer = () => {
  const { isModalOpen, setIsModalOpen } = useModalContext();
  const [modalType, setModalType] = useState<
    "terms" | "about" | "cookie" | "user-guide" | null
  >(null);

  const handleModalOpen = (
    type: "terms" | "about" | "cookie" | "user-guide"
  ) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  const renderModalContent = () => {
    switch (modalType) {
      case "terms":
        return <TermsAndConditions onUnderstand={handleModalClose} />;
      case "about":
        return <About onUnderstand={handleModalClose} />;
      case "cookie":
        return <CookiePolicy onUnderstand={handleModalClose} />;
      case "user-guide":
        return <UserGuide onUnderstand={handleModalClose} />;
      default:
        return null;
    }
  };

  return (
    <>
      {isModalOpen && modalType && <Modal>{renderModalContent()}</Modal>}

      <footer
        className="bg-[#0b1220] mt-10 border-t border-[#1b2a44] text-gray-200"
        style={{ boxShadow: "0px -12px 16px -7px rgb(25 36 59)" }}
      >
        <div className="max-w-7xl mx-auto pt-10 px-6 flex flex-col items-center text-center md:items-start md:text-left md:flex-row justify-between gap-8 md:gap-48">
          {/* Contact Section */}
          <div className="w-full md:w-auto">
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <ul className="space-y-2 pl-0 text-sm list-inside flex flex-col items-center md:items-start">
              <li className="flex items-center space-x-3">
                <HiOutlineChatAlt2 className="text-[#2fd07f] w-5 h-5" />
                <a>+54 9 341-3189431</a>
              </li>
              <li className="flex items-center space-x-3">
                <HiOutlineMail className="text-[#2fd07f] w-5 h-5" />
                <a>agustinbutti-cs@hotmail.com</a>
              </li>
            </ul>
          </div>

          {/* Backups Section (FAQ & About) */}
          <div className="w-full md:w-auto">
            <h2 className="text-xl font-bold tracking-wide mb-2">Backups</h2>
            <ul className="space-y-2 pl-0 text-sm list-inside flex flex-col items-center md:items-start">
              <li className="flex items-center space-x-3">
                <HiOutlineInformationCircle className="text-[#2fd07f] w-5 h-5" />
                <a
                  href="#"
                  className="hover:text-[#2fd07f] cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    handleModalOpen("about");
                  }}
                >
                  About
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <HiOutlineBookOpen className="text-[#2fd07f] w-5 h-5" />
                <a
                  href="#"
                  className="hover:text-[#2fd07f] cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    handleModalOpen("user-guide");
                  }}
                >
                  User Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div className="w-full md:w-auto">
            <h3 className="text-lg font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 pl-0 text-sm list-inside flex flex-col items-center md:items-start">
              <li className="flex items-center space-x-3">
                <HiOutlineDocument className="text-[#2fd07f] w-5 h-5" />
                <a
                  className="hover:text-[#2fd07f] cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    handleModalOpen("terms");
                  }}
                >
                  Terms & Conditions
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <HiOutlineDocumentText className="text-[#2fd07f] w-5 h-5" />
                <a
                  href="#"
                  className="hover:text-[#2fd07f] cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    handleModalOpen("cookie");
                  }}
                >
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
