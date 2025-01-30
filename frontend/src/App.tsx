import { ReactNode } from "react";
import { NavBar } from "./components";

interface Props {
  children: ReactNode;
}

const App = ({ children }: Props) => {
  return (
    <>
      <NavBar /> 
      {children}
    </>
  );
};

export default App;
