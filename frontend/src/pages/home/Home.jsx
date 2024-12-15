//components
import { Button } from "../../components/common";

//react router dom
import { Link } from "react-router-dom";
export default function Home() {
  return (
    <>
      <h2 style={{ color: "green" }}>Home</h2>
      <Link to="/dashboard">
        <Button label="dashboard"></Button>
      </Link>
    </>
  );
}
