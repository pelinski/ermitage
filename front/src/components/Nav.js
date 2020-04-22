import React from "react";
import { Link, useLocation } from "react-router-dom"
import { useUserLogout, useUser } from "../api/auth.api"
import { Searchbar } from "./Searchbar";

import { ArchiveIcon, LogoutIcon } from "../components/Icons"

export const LoggedinNav = () => {
  const handleLogout = useUserLogout();
  const { username } = useUser();
  const isHome = useLocation().pathname == "/";
  if (isHome) {
    return (<nav class="home">

      <span >
        <Link to={`/${username}/dashboard`} style={{ paddingRight: "4px" }}><ArchiveIcon /></Link>   <p>Go to your dashboard</p>
      </span>

      <span >
        <Searchbar />
        <p>Search users</p>
      </span>
      <span >
        <Link style={{ paddingRight: "5px" }} to="/" onClick={handleLogout}><LogoutIcon /></Link>
        <p>Logout</p>
      </span>
    </nav >)
  } else {
    return (<>
      <nav>
        <span>
          <Searchbar />
        </span>
        <span>
          <Link to={`/${username}/dashboard`} ><ArchiveIcon /></Link>
        </span>
        <span>
          <Link to="/" onClick={handleLogout}><LogoutIcon /></Link>
        </span>
      </nav>
    </>)
  }
}
