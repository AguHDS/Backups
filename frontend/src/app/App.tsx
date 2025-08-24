import { ReactNode } from "react";
import { NavBar } from "@/shared/components/navbar/NavBar";
import { Footer } from "@/shared/components/footer/Footer";
interface Props {
  children: ReactNode;
}

const App = ({ children }: Props) => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};


export default App;
