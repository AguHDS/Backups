import { ReactNode } from "react";
import { MainLayout } from "../shared";

interface Props {
  children: ReactNode;
}

const App = ({ children }: Props) => {
  return (
    <>
      <MainLayout />
      {children}
    </>
  );
};

export default App;
