import { Link } from "react-router-dom";
export const Home = () => {
    return (
        <>
         <h1 className="text-yellow-400">Home</h1>;
         <Link to="/dashboard">
            <button>To Dashboard</button>
         </Link>
         </>
    )
  };
  