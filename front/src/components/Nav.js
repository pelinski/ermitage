import React from "react";
import { Link, useLocation } from "react-router-dom"
import { useUserLogout, useUser } from "../api/auth.api"
import { Searchbar } from "./Searchbar";

import { ArchiveIcon, LogoutIcon } from "../components/Icons"

export const LoggedinNav = () => {
  const handleLogout = useUserLogout();
  const { username } = useUser();
  const isHome = useLocation().pathname == "/";

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

