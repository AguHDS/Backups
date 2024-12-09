import {Link} from "react-router-dom";
import {Button} from "../../components/common";

export default function Dashboard() {
  return (
    <>
      <div className="text-9xl text-green-300">Dashboard</div>
      <Link to="/home">
        <Button label="Go Home"></Button>
      </Link>
    </>
  );
}
