import { Link } from "react-router-dom";
import { Button } from "..";

export function NotFound() {
  return (
    <div className="fixed inset-0 bg-[#] backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#374151] rounded-xl shadow-2xl w-full max-w-md transform transition-all">
        <div className="p-6">
          <h2 className="text-2xl text-gray-300 text-center mb-3">
            Not Found
          </h2>
          <p className="text-gray-300 text-center mb-6">
            The resource you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="flex justify-center">
            <Link to="/">
              <Button label="Back to homepage" className="backupsBtn"></Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
