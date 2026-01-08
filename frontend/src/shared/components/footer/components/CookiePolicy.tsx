import { Button } from "@/shared/components";

interface Props {
  onUnderstand: () => void;
}

export const CookiePolicy = ({ onUnderstand }: Props) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-[#232d42] border-2 border-[#3a4a68] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-[#232d42] to-[#2a3650] border-b border-[#3a4a68] p-6 z-10">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white text-center w-full">
              Cookie Policy
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
                This Cookie Policy explains how Backups (&quot;we&quot;,
                &quot;us&quot;, or &quot;our&quot;) uses cookies and similar
                technologies on our website. By using our services, you consent
                to the use of cookies as described in this policy.
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
              <h2 className="text-xl font-semibold text-white mb-4">
                Cookie Details by Service
              </h2>
              <div className="space-y-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-[#2fd07f]">
                    BetterAuth Cookies
                  </h3>
                  <p className="text-gray-300">
                    BetterAuth uses essential cookies for authentication and
                    session management:
                  </p>
                  <ul className="list-disc pl-6 text-gray-300 space-y-2">
                    <li>
                      <strong>Session Cookies:</strong> Temporary cookies that
                      keep you logged in during your browsing session
                    </li>
                    <li>
                      <strong>Authentication Tokens:</strong> Secure tokens that
                      verify your identity without storing sensitive data on
                      your device
                    </li>
                    <li>
                      <strong>Preference Cookies:</strong> Remember your login
                      preferences and settings
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-[#2fd07f]">
                    Cloudinary Cookies
                  </h3>
                  <p className="text-gray-300">
                    Cloudinary may use cookies for image processing and CDN
                    optimization:
                  </p>
                  <ul className="list-disc pl-6 text-gray-300 space-y-2">
                    <li>
                      <strong>Performance Cookies:</strong> Optimize image
                      delivery based on your device and network
                    </li>
                    <li>
                      <strong>Caching Cookies:</strong> Improve loading times
                      for frequently accessed images
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-[#2fd07f]">
                    Our Application Cookies
                  </h3>
                  <p className="text-gray-300">
                    Additional cookies we use for application functionality:
                  </p>
                  <ul className="list-disc pl-6 text-gray-300 space-y-2">
                    <li>
                      <strong>Preferences:</strong> Remember your theme
                      selection, language, and display settings
                    </li>
                    <li>
                      <strong>Security:</strong> Protect against cross-site
                      request forgery (CSRF) and other attacks
                    </li>
                    <li>
                      <strong>Analytics (Anonymous):</strong> Basic usage
                      statistics to improve our service (no personal tracking)
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-[#1a2234]/50 p-6 rounded-lg border border-[#3a4a68] mt-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                Managing Cookies
              </h2>
              <p className="text-gray-300 mb-3">
                Most web browsers allow you to control cookies through their
                settings. However, please note that disabling essential cookies
                may affect the functionality of our website:
              </p>
              <ul className="list-disc pl-6 text-gray-300 space-y-2">
                <li>
                  <strong>Essential Cookies:</strong> Required for basic
                  functionality. Cannot be disabled.
                </li>
                <li>
                  <strong>Browser Settings:</strong> You can usually find cookie
                  controls in your browser&apos;s &quot;Privacy&quot; or
                  &quot;Security&quot; settings
                </li>
                <li>
                  <strong>Third-Party Cookies:</strong> Manage third-party
                  cookies through your browser settings or using browser
                  extensions
                </li>
              </ul>
            </div>

            <div className="text-center p-6 border-t border-[#3a4a68] mt-8">
              <p className="text-gray-300 italic mb-6">
                By continuing to use our website, you consent to our use of
                cookies as described in this policy.
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
    title: "What Are Cookies?",
    content: [
      "Cookies are small text files that are stored on your device when you visit a website. They help the website remember information about your visit, which can make it easier to visit the site again and make the site more useful to you.",
      "Our website uses cookies for essential functions like authentication, security, and remembering your preferences. We do not use cookies for intrusive tracking or advertising purposes.",
    ],
  },
  {
    title: "Types of Cookies We Use",
    content: [
      "Essential Cookies: Required for the website to function properly. These include authentication cookies that keep you logged in and secure during your session.",
      "Functionality Cookies: Remember your preferences and settings to enhance your experience on our platform.",
      "Performance Cookies: Help us understand how visitors interact with our website, allowing us to improve performance and fix issues.",
    ],
  },
  {
    title: "Purpose of Cookies",
    content: [
      "To maintain your login session securely through BetterAuth authentication",
      "To remember your preferences (theme, language, display settings)",
      "To enable file uploads and image processing through Cloudinary integration",
      "To ensure the security and integrity of our platform",
      "To provide basic analytics for service improvement",
    ],
  },
  {
    title: "Third-Party Services",
    content: [
      "BetterAuth: Our authentication provider uses essential cookies for secure login sessions and user identification.",
      "Cloudinary: Our image processing service may use cookies for optimizing image delivery and caching. These cookies help improve loading times and reduce bandwidth usage.",
      "These third-party cookies are governed by the respective privacy policies of these services.",
    ],
  },
  {
    title: "Data Storage and Security",
    content: [
      "Cookie data is encrypted and stored securely on your device",
      "Session cookies are automatically deleted when you close your browser",
      "Persistent cookies have limited lifespans (typically 30 days or less)",
      "We do not store sensitive personal information in cookies",
      "All authentication tokens are securely hashed and regularly rotated",
    ],
  },
  {
    title: "Your Rights and Choices",
    content: [
      "You have the right to know what cookies are being used and for what purpose",
      "You can manage or delete cookies through your browser settings",
      "You may withdraw consent for non-essential cookies at any time",
      "Please note that disabling essential cookies will prevent you from using key features of our service",
    ],
  },
  {
    title: "Updates to This Policy",
    content: [
      "We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons.",
      "We will notify users of any material changes by updating the &quot;Last updated&quot; date at the top of this policy and, where appropriate, through other notification methods.",
      "Your continued use of our services after any changes indicates your acceptance of the updated policy.",
    ],
  },
];
