import { NavBar } from "./components";

const App = ({ children }) => {
  return (
    <>
      <NavBar /> 
      {children}
    </>
  );
};

export default App;
