import { NavLink } from "react-router-dom";

export const Home = () => {
  return (
    <div>
      <div className="mt-4 p-6">
        <h2>Projetos</h2>
        <ul>
          {/* <li>
            <NavLink
              to={"/project/celebrity-ice-bucket-challenge"}
              className="text-blue-500"
            >
              Celebrity Ice Bucket Challenge
            </NavLink>
          </li> */}
          <li>
            <NavLink to={"/project/analise-76"} className="text-blue-500">
              Alvos e Facções - 76ª CIPM
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};
