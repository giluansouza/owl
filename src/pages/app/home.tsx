import { NavLink } from "react-router-dom";

export const Home = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold">Owl!</h1>

      <div>
        <h2>Projetos</h2>
        <ul>
          <li>
            <NavLink to={"/project/celebrity-ice-bucket-challenge"}>
              Celebrity Ice Bucket Challenge
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};
