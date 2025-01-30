interface Props {
  userStatus: string;
  role: string;
  friendsCounter: number;
  partner: string;
}

export const UserInfo = ({ userStatus, role, friendsCounter, partner }: Props) => {
  return (
    <ul className="mt-5 border-t border-solid border-[#141414] p-0 list-none">
      <li className="bg-[#121212] p-1 flex justify-between">
        <span>status</span>
        <span className="text-gray-400">{userStatus}</span>
      </li>
      <li className="bg-[#121212] p-1 flex justify-between">
        <span>role</span>
        <span className="text-gray-400">
          {role}
        </span>
      </li>
      <li className="bg-[#121212] p-1 flex justify-between">
        <span>friends</span>
        <span>{friendsCounter}</span>
      </li>
      <li className="bg-[#121212] p-1 flex justify-between">
        <span>partner</span>
        <span className="text-gray-400 text-sm">
          {partner}
        </span>
      </li>
    </ul>
  );
};
