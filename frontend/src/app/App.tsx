import { ReactNode } from "react";
import { NavBar } from "@/shared/components/navbar/NavBar";
import { Footer } from "@/shared/components/footer/Footer";
interface Props {
  children: ReactNode;
}

const App = ({ children }: Props) => {
  return (
    <>
      <NavBar />
      {children}
      <Footer />
    </>
  );
};

export default App;
