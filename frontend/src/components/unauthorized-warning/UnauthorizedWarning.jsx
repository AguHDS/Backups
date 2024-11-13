export default function UnauthorizedWarning() {
  return (
    <div
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#696e76] border-t-4 rounded-md text-[#cdcdcd] px-4 py-3 shadow-md"
      role="alert"
    >
      <div className="flex">
        <div className="py-1"></div>
        <div>
          <p className="font-bold">
            You must be logged to see the main features
          </p>
          <p className="text-sm">Sign in or create an account</p>
        </div>
      </div>
    </div>
  );
}
