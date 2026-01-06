import { Button } from "@/shared/components";

interface Props {
  onUnderstand: () => void;
}

export const TermsAndConditions = ({ onUnderstand }: Props) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-[#232d42] border-2 border-[#3a4a68] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-[#232d42] to-[#2a3650] border-b border-[#3a4a68] p-6 z-10">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white text-center w-full">
              Terms and Conditions of Use
            </h1>
          </div>
          <p className="text-gray-300 text-center mt-2">
            Last updated:{" "}
            {new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="p-6 md:p-8 text-gray-200">
          <div className="space-y-8">
            <div className="bg-[#1a2234]/50 p-6 rounded-lg border-l-4 border-[#2fd07f]">
              <p className="text-base leading-relaxed">
                By registering and using our services, you agree to comply with
                the following terms and conditions. Please read this document
                carefully before proceeding.
              </p>
            </div>

            <div className="space-y-8">
              {sections.map((section, index) => (
                <section key={index} className="space-y-4 group">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-[#2fd07f] rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                    <h2 className="text-xl font-semibold text-white group-hover:text-[#2fd07f] transition-colors duration-200">
                      {section.title}
                    </h2>
                  </div>

                  <div className="ml-11 space-y-3">
                    {section.content.map((paragraph, pIndex) => (
                      <div key={pIndex} className="flex items-start space-x-3">
                        <span className="text-[#2fd07f] font-medium mt-0.5">
                          {index + 1}.{pIndex + 1}.
                        </span>
                        <p className="text-gray-300 leading-relaxed">
                          {paragraph}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="bg-[#1a2234]/50 p-6 rounded-lg border border-[#3a4a68] mt-8">
              <h2 className="text-xl font-semibold text-white mb-4">Contact</h2>
              <p className="text-gray-300">
                If you have any questions about these terms, you can contact an
                admin using the contact information in the footer of our
                website.
              </p>
            </div>

            <div className="text-center p-6 border-t border-[#3a4a68] mt-8">
              <p className="text-gray-300 italic mb-6">
                By registering, the user confirms that they have read,
                understood, and accepted these terms and conditions in their
                entirety.
              </p>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Button
                  label="I Understand & Accept"
                  onClick={onUnderstand}
                  className="bg-gradient-to-r from-[#2fd07f] to-emerald-500 hover:from-emerald-500 hover:to-[#2fd07f] text-white px-10 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const sections = [
  {
    title: "Definitions",
    content: [
      '"User": Any person who registers and uses the Application.',
      '"Content": Files, documents, images, videos, or other materials uploaded to the Application.',
    ],
  },
  {
    title: "Registration and Authentication",
    content: [
      "To use our services, you must register by providing truthful and up-to-date information.",
      "It is the user's responsibility to maintain the confidentiality of their access credentials.",
      "Backups will not be liable for unauthorized access to your account due to user negligence.",
    ],
  },
  {
    title: "Use of the Application",
    content: [
      "The user may upload personal files to the Application, with the option to set them as public or private.",
      "The following is prohibited: Uploading illegal, offensive, defamatory content, or content that infringes the rights of third parties (including copyright).",
      "The following is prohibited: Using the Application for fraudulent activities or malicious purposes.",
    ],
  },
  {
    title: "Ownership and Licenses",
    content: [
      "The rights to the content uploaded by the user remain with the user.",
      "By uploading content, the user grants Backups a limited, non-exclusive, and revocable license to store and display such content according to the selected privacy settings.",
    ],
  },
  {
    title: "Privacy and Data Protection",
    content: [
      "The Application complies with all applicable data protection laws.",
      "The information collected will be used solely to provide the offered services and improve the user experience.",
    ],
  },
  {
    title: "User Responsibility",
    content: [
      "The user assumes all responsibility for the content they upload to the Application.",
      "Backups reserves the right to delete or restrict access to content that violates these terms.",
    ],
  },
  {
    title: "Service Availability and Data Integrity",
    content: [
      "Backups provides the service on an 'as is' and 'as available' basis.",
      "We do not warrant that the service will be uninterrupted, timely, secure, or error-free.",
      "Users acknowledge that data loss may occur due to various factors including but not limited to: server failures, software bugs, network issues, or force majeure events.",
      "It is the user's responsibility to maintain independent backups of all critical files.",
    ],
  },
  {
    title: "Limitation of Liability",
    content: [
      "Backups is not responsible for damages or losses arising from the use of the Application.",
      "Backups is not responsible for unauthorized access to content due to technical failures or external vulnerabilities.",
      "Backups does not guarantee the permanent availability or integrity of uploaded content. Users are solely responsible for maintaining their own backups of important files.",
      "In no event shall Backups be liable for any loss of data, corruption of files, or inability to access uploaded content.",
    ],
  },
  {
    title: "Changes to Terms",
    content: [
      "We reserve the right to modify these terms at any time. Updates will be notified to the user, who must accept them to continue using the Application.",
    ],
  },
  {
    title: "Account Cancellation",
    content: [
      "The user may cancel their account at any time through the Application settings.",
      "Backups may also suspend or cancel accounts that violate these terms.",
    ],
  },
  {
    title: "Jurisdiction and Applicable Law",
    content: [
      "These terms are governed by the laws of the applicable jurisdiction.",
      "Any related dispute will be submitted to the competent courts of the designated region.",
    ],
  },
];
