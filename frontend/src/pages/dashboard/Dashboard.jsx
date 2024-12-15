//components
import { Button } from "../../components/common";

//react router dom
import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <>
      <h2 style={{ color: "green" }}>Correctly authenticated</h2>
      <div className="contentWrapper">

        <Link to="/">
          <Button label="To home"></Button>
        </Link>
      </div>
    </>
  );
}
