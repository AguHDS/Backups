import React from "react";
import { Button } from "..";

interface Props {
  onUnderstand: () => void;
}

export const TermsAndConditions = ({ onUnderstand }: Props) => {
  return (
    <div className="inset-0 isolate flex items-center justify-center p-4  bg-opacity-30">
      <div className="bg-gray-600 rounded w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-5 text-white">
          <h1 className="text-3xl mb-8 text-center">
            Terms and Conditions of Use
          </h1>
          <div className="text-sm space-y-6">
            <p className="mb-4">
              By registering and using our services, you agree to comply with
              the following terms and conditions. Please read this document
              carefully before proceeding.
            </p>
            <section className="space-y-2">
              <h2 className="text-lg mb-2">1. Definitions</h2>
              <p>
                1.1. "user": Any person who registers and uses the Application.
              </p>
              <p>
                1.2. "content": Files, documents, images, videos, or other
                materials uploaded to the Application.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-lg mb-2">
                2. Registration and Authentication
              </h2>
              <p>
                2.1. To use our services, you must register by providing
                truthful and up-to-date information.
              </p>
              <p>
                2.2. It is the user's responsibility to maintain the
                confidentiality of their access credentials.
              </p>
              <p>
                2.3. Backups will not be liable for unauthorized access to your
                account due to user negligence.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-lg mb-2">3. Use of the Application</h2>
              <p>
                3.1. The user may upload personal files to the Application, with
                the option to set them as public or private.
              </p>
              <p>3.2. The following is prohibited:</p>
              <ul className="list-disc pl-8">
                <li>
                  Uploading illegal, offensive, defamatory content, or content
                  that infringes the rights of third parties (including
                  copyright).
                </li>
                <li>
                  Using the Application for fraudulent activities or malicious
                  purposes.
                </li>
              </ul>
            </section>
            <section className="space-y-2">
              <h2 className="text-lg  mb-2">4. Ownership and Licenses</h2>
              <p>
                4.1. The rights to the content uploaded by the user remain with
                the user.
              </p>
              <p>
                4.2. By uploading content, the user grants Backups a limited,
                non-exclusive, and revocable license to store and display such
                content according to the selected privacy settings.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-lg mb-2">5. Privacy and Data Protection</h2>
              <p>
                5.1. The Application complies with all applicable data
                protection laws.
              </p>
              <p>
                5.2. The information collected will be used solely to provide
                the offered services and improve the user experience.s
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-lg mb-2">6. user Responsibility</h2>
              <p>
                6.1. The user assumes all responsibility for the content they
                upload to the Application.
              </p>
              <p>
                6.2. Backups reserves the right to delete or restrict access to
                content that violates these terms.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-lg mb-2">7. Limitation of Liability</h2>
              <p>7.1. Backups is not responsible for:</p>
              <ul className="list-disc pl-8">
                <li>
                  Damages or losses arising from the use of the Application.
                </li>
                <li>
                  Unauthorized access to content due to technical failures or
                  external vulnerabilities.
                </li>
              </ul>
            </section>
            <section className="space-y-2">
              <h2 className="text-lg mb-2">8. Changes to Terms</h2>
              <p>
                8.1. We reserve the right to modify these terms at any time.
                Updates will be notified to the user, who must accept them to
                continue using the Application.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-lg mb-2">9. Account Cancellation</h2>
              <p>
                9.1. The user may cancel their account at any time through the
                Application settings.
              </p>
              <p>
                9.2. Backups may also suspend or cancel accounts that violate
                these terms.
              </p>
            </section>
            <section className="space-y-2">
              <h2 className="text-lg mb-2">
                10. Jurisdiction and Applicable Law
              </h2>
              <p>
                10.1. These terms are governed by the laws of [applicable
                country or jurisdiction].
              </p>
              <p>
                10.2. Any related dispute will be submitted to the competent
                courts of [city or region].
              </p>
            </section>
            <section className="space-y-2 mt-8">
              <h2 className="text-lg mb-2">Contact</h2>
              <p>
                If you have any questions about these terms, you can contact an
                admin using the contact information in the footer
              </p>
            </section>
            <p className="mt-8 text-center">
              By registering, the user confirms that they have read and accepted
              these terms and conditions.
            </p>
          </div>
          <div className="text-center mt-5 flex justify-center">
            <Button
              label="I understand"
              onClick={onUnderstand}
              className="backupsBtn bg-gray-500 h-6 mx-2 flex items-center text-white px-8 py-4 rounded-lg shadow-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
