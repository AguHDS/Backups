import { Button } from "@/shared/components";

interface Props {
  onUnderstand: () => void;
}

export const UserGuide = ({ onUnderstand }: Props) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-[#232d42] border-2 border-[#3a4a68] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-[#232d42] to-[#2a3650] border-b border-[#3a4a68] p-6 z-10">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white text-center w-full">
              User Guide
            </h1>
          </div>
        </div>

        <div className="p-6 md:p-8 text-gray-200">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-[#2fd07f] mb-4 border-b border-[#3a4a68] pb-2">
                Welcome to Backups
              </h2>
              <p className="mb-4">
                Backups is a secure platform for storing and organizing your
                images. This guide will help you understand how to use all the
                features available.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2fd07f] mb-4 border-b border-[#3a4a68] pb-2">
                Getting Started
              </h2>

              <div className="space-y-4">
                <div className="bg-[#1e2639] p-4 rounded-lg border-l-4 border-[#2fd07f]">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    1. Registration &amp; Login
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      If you&apos;re not logged in, you&apos;ll see the home
                      page at{" "}
                      <code className="bg-[#0b1220] px-2 py-1 rounded">/</code>
                    </li>
                    <li>Register with your email and create a username</li>
                    <li>
                      After successful registration and login, you&apos;ll be
                      redirected to the dashboard
                    </li>
                  </ul>
                </div>

                <div className="bg-[#1e2639] p-4 rounded-lg border-l-4 border-[#2fd07f]">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    2. Your Dashboard
                  </h3>
                  <p className="mb-2">
                    Once logged in, you&apos;ll access your dashboard at{" "}
                    <code className="bg-[#0b1220] px-2 py-1 rounded">
                      /dashboard
                    </code>{" "}
                    where you can see:
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      <strong>Storage Available:</strong> How much space you
                      have left
                    </li>
                    <li>
                      <strong>Files Uploaded:</strong> Total number of images
                      uploaded
                    </li>
                    <li>
                      <strong>Account Status:</strong> Overview of your account
                      usage
                    </li>
                  </ul>
                </div>

                <div className="bg-[#1e2639] p-4 rounded-lg border-l-4 border-[#2fd07f]">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    3. Your Profile
                  </h3>
                  <p className="mb-2">
                    After registration, your profile is automatically created
                    at:
                  </p>
                  <code className="block bg-[#0b1220] px-4 py-2 rounded mb-3">
                    /profile/your-username
                  </code>
                  <p>
                    This is your personal space where you can organize your
                    content.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2fd07f] mb-4 border-b border-[#3a4a68] pb-2">
                Managing Your Content
              </h2>

              <div className="space-y-4">
                <div className="bg-[#1e2639] p-4 rounded-lg border-l-4 border-[#3a4a68]">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Creating Sections
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      In your profile, you can create sections to organize your
                      images
                    </li>
                    <li>Each section acts as a folder for related images</li>
                    <li>You can give each section a descriptive name</li>
                  </ul>
                </div>

                <div className="bg-[#1e2639] p-4 rounded-lg border-l-4 border-[#3a4a68]">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Uploading Images
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Navigate to a section and click &quot;Upload Images&quot;
                    </li>
                    <li>Supported formats: JPG, PNG, GIF, WebP</li>
                    <li>You can upload multiple images at once</li>
                    <li>
                      Each image is securely stored, optimized in render and
                      backed up
                    </li>
                  </ul>
                </div>

                <div className="bg-[#1e2639] p-4 rounded-lg border-l-4 border-[#3a4a68]">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Privacy Settings
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Each section can be set as <strong>Public</strong> or{" "}
                      <strong>Private</strong>
                    </li>
                    <li>
                      <strong>Public:</strong> Visible to anyone with the link
                    </li>
                    <li>
                      <strong>Private:</strong> Only visible to you or an admin
                    </li>
                    <li>You can change privacy settings at any time</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2fd07f] mb-4 border-b border-[#3a4a68] pb-2">
                Account Limits &amp; Storage
              </h2>

              <div className="bg-[#1e2639] p-4 rounded-lg border-l-4 border-[#d0632f]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Free Account (User Role)
                    </h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        <strong>Maximum Sections:</strong> 1 section
                      </li>
                      <li>
                        <strong>Storage Limit:</strong> 100MB total
                      </li>
                      <li>
                        <strong>Image Formats:</strong> All standard formats
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Tips for Free Users
                    </h3>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Delete unused images to free up space</li>
                      <li>
                        Organize images within your single section using
                        descriptive filenames
                      </li>
                      <li>
                        Regularly check your storage usage in the dashboard
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2fd07f] mb-4 border-b border-[#3a4a68] pb-2">
                Best Practices
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#1e2639] p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Organization
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Use clear section names</li>
                    <li>Add descriptive filenames to images</li>
                    <li>Regularly review and delete outdated images</li>
                    <li>Use appropriate privacy settings for each section</li>
                  </ul>
                </div>

                <div className="bg-[#1e2639] p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Security
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Keep your login credentials secure</li>
                    <li>Use strong passwords</li>
                    <li>Log out when using shared devices</li>
                    <li>Regularly check your account activity</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-r from-[#1e2639] to-[#232d42] p-4 rounded-lg border border-[#3a4a68]">
              <h2 className="text-xl font-bold text-white mb-3">Need Help?</h2>
              <p className="mb-3">
                If you encounter any issues or have questions about using
                Backups, please don&apos;t hesitate to contact our support team.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Email:</strong> agustinbutti-cs@hotmail.com
                </li>
                <li>
                  <strong>Phone:</strong> +54 9 341-3189431
                </li>
                <li>
                  <strong>Response Time:</strong> Typically within 24 hours
                </li>
              </ul>
            </section>

            <div className="text-center mt-8 pt-6 border-t border-[#3a4a68]">
              <Button
                label="Close Guide"
                onClick={onUnderstand}
                className="bg-gradient-to-r from-[#2fd07f] to-emerald-500 hover:from-emerald-500 hover:to-[#2fd07f] text-white px-10 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
