interface Props {
  userStatus: string;
  role: "user" | "admin";
  level: string;
}

export const UserInfo = ({ userStatus, role, level }: Props) => {
  return (
    <ul className="mt-5 text-gray-400 border-t border-solid border-[#141414] p-0 list-none">
      <li className="bg-[#121212] p-1 flex justify-between">
        <span>status</span>
        <span
          className={`${userStatus === "online" ? "text-green-500" : "text-gray-400"}`}
        >
          {userStatus}
        </span>
      </li>
      <li className="bg-[#121212] p-1 flex justify-between">
        <span>role</span>
        <span className="text-gray-400">{role}</span>
      </li>
      <li className="bg-[#121212] p-1 flex justify-between">
        <span>level</span>
        <span className="text-gray-400">{level}</span>
      </li>
    </ul>
  );
};
