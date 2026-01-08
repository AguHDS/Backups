import { Button } from "@/shared/components";

interface Props {
  onUnderstand: () => void;
}

export const About = ({ onUnderstand }: Props) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-[#232d42] border-2 border-[#3a4a68] rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-gradient-to-r from-[#232d42] to-[#2a3650] border-b border-[#3a4a68] p-6 z-10">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white text-center w-full">
              About Backups
            </h1>
          </div>
        </div>

        <div className="p-6 md:p-8 text-gray-200">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-[#2fd07f] mb-4 border-b border-[#3a4a68] pb-2">
                Our Mission &amp; Vision
              </h2>
              <div className="space-y-4">
                <div className="bg-[#1e2639] p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    The Problem We Solve
                  </h3>
                  <p>
                    Backups provides a simple, reliable solution for image
                    storage and organization. In a world where digital memories
                    accumulate, we offer a dedicated space to securely store,
                    categorize, and access your images without complexity.
                  </p>
                </div>

                <div className="bg-[#1e2639] p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Why Backups Was Created
                  </h3>
                  <p>
                    What started as a personal challenge and a solution for my
                    own storage needs has evolved into a platform I&apos;m proud
                    to share. Backups represents the intersection of practical
                    problem-solving and technical craftsmanship.
                  </p>
                </div>

                <div className="bg-[#1e2639] p-4 rounded-lg border-l-4 border-[#2fd07f]">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Our Primary Goal
                  </h3>
                  <p>
                    To transform Backups from a passion project into a genuinely
                    valuable and sustainable service. We&apos;re committed to
                    creating something that users love while building a viable
                    platform for the long term.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2fd07f] mb-4 border-b border-[#3a4a68] pb-2">
                What Makes Backups Unique
              </h2>

              <div className="bg-gradient-to-r from-[#1e2639] to-[#232d42] p-6 rounded-lg border border-[#3a4a68]">
                <div className="flex items-start mb-4">
                  <div className="bg-[#2fd07f] text-white p-3 rounded-lg mr-4">
                    <span className="text-xl font-bold">🎮</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Progression System
                    </h3>
                    <p className="mb-3">
                      Unlike traditional storage services, Backups features an
                      engaging leveling system where users can earn rewards
                      through daily missions and consistent use.
                    </p>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                      <li>
                        <strong>Level Up:</strong> Complete daily missions to
                        gain experience
                      </li>
                      <li>
                        <strong>Earn Rewards:</strong> Unlock additional storage
                        space as you progress
                      </li>
                      <li>
                        <strong>More Sections:</strong> Higher levels grant more
                        organizational sections
                      </li>
                      <li>
                        <strong>Achievements:</strong> Reach milestones for
                        special benefits
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2fd07f] mb-4 border-b border-[#3a4a68] pb-2">
                Core Features
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#1e2639] p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <span className="text-[#2fd07f] mr-2">📁</span> Profiles
                    &amp; Sections
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Personalized user profiles with custom URLs</li>
                    <li>Organized sections for different image categories</li>
                    <li>Flexible privacy controls (public/private)</li>
                    <li>Clean, intuitive organization system</li>
                  </ul>
                </div>

                <div className="bg-[#1e2639] p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <span className="text-[#2fd07f] mr-2">⚡</span> Leveling
                    System
                  </h3>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Gamified progression with daily missions</li>
                    <li>Rewards for consistent platform engagement</li>
                    <li>Unlockable benefits and features</li>
                    <li>Achievement-based advancement</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2fd07f] mb-4 border-b border-[#3a4a68] pb-2">
                Technology &amp; Security
              </h2>

              <div className="space-y-4">
                <div className="bg-[#1e2639] p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Secure Image Storage
                  </h3>
                  <p className="mb-3">
                    We prioritize your data&apos;s safety using industry-leading
                    services:
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-[#0b1220] px-3 py-1 rounded text-sm">
                      Cloudinary
                    </span>
                    <span className="bg-[#0b1220] px-3 py-1 rounded text-sm">
                      BetterAuth
                    </span>
                    <span className="bg-[#0b1220] px-3 py-1 rounded text-sm">
                      Secure APIs
                    </span>
                    <span className="bg-[#0b1220] px-3 py-1 rounded text-sm">
                      Encryption
                    </span>
                  </div>
                </div>

                <div className="bg-[#1e2639] p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Technical Stack
                  </h3>
                  <p className="mb-3">
                    Built with modern, reliable technologies for optimal
                    performance:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="bg-[#0b1220] p-3 rounded text-center">
                      <div className="font-bold text-[#2fd07f]">Node.js</div>
                      <div className="text-xs text-gray-400">
                        Backend Runtime
                      </div>
                    </div>
                    <div className="bg-[#0b1220] p-3 rounded text-center">
                      <div className="font-bold text-[#2fd07f]">React</div>
                      <div className="text-xs text-gray-400">
                        Frontend Framework
                      </div>
                    </div>
                    <div className="bg-[#0b1220] p-3 rounded text-center">
                      <div className="font-bold text-[#2fd07f]">TypeScript</div>
                      <div className="text-xs text-gray-400">Type Safety</div>
                    </div>
                    <div className="bg-[#0b1220] p-3 rounded text-center">
                      <div className="font-bold text-[#2fd07f]">SQL</div>
                      <div className="text-xs text-gray-400">Database</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-[#2fd07f] mb-4 border-b border-[#3a4a68] pb-2">
                Our Design Philosophy
              </h2>

              <div className="bg-gradient-to-r from-[#1e2639] to-[#232d42] p-6 rounded-lg border border-[#3a4a68]">
                <div className="flex items-start">
                  <div className="bg-[#2fd07f] text-white p-3 rounded-lg mr-4">
                    <span className="text-xl font-bold">🎯</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      Simple Yet Effective
                    </h3>
                    <p className="mb-4">
                      We believe powerful tools don&apos;t need to be
                      complicated. Every feature in Backups is designed with
                      clarity and purpose, ensuring you spend less time figuring
                      out the interface and more time organizing your images.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-white mb-2">
                          Simplicity First
                        </h4>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          <li>Intuitive navigation</li>
                          <li>Clean, uncluttered interface</li>
                          <li>Minimal learning curve</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">
                          Maximum Impact
                        </h4>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          <li>Features that actually matter</li>
                          <li>Efficient workflows</li>
                          <li>Clear value proposition</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div className="text-center mt-4">
              <Button
                label="Close"
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
