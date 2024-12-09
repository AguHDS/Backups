//components
import { Button } from "../../components/common/";

//react router dom
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <>
      <h2 style={{ color: "green" }}>Correctly authenticated</h2>
      <div className="contentWrapper">

        <Link to="/">
          <Button label="To dashboard"></Button>
        </Link>
      </div>
    </>
  );
}
