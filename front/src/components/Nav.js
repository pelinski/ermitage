import React from "react";
import { Link } from "react-router-dom"
import { useUserLogout, useUser } from "../api/auth.api"
import { Searchbar } from "./Searchbar";

export const LoggedinNav = () => {
  const handleLogout = useUserLogout();
  const { username } = useUser();
  return (<>
    <nav>
      <span>
        <Searchbar />
      </span>
      <span>
        <Link to={`/${username}/dashboard`} >Dashboard</Link>
      </span>
      <span>
        <Link to="/" onClick={handleLogout}>Logout</Link>
      </span>

    </nav>
  </>)
}

