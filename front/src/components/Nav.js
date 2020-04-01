import React from "react";
import { Link } from "react-router-dom"
import { useUserLogout, useUser } from "../lib/auth.api"

export const LoggedinNav = () => {
  const handleLogout = useUserLogout();
  const { username } = useUser();

  return (<>

    <nav>
      <p>Hi, {username}</p>
      <span>
        <Link to={`/${username}/dashboard`} >Dashboard</Link>
      </span>
      <span>
        <Link to="/" onClick={handleLogout}>Logout</Link>
      </span>

    </nav>
  </>)
}

export const VisitorNav = () => {

  return (<>

    <nav>
      <span>
        <Link to="/aboutus">About us</Link>
      </span>
      <span>
        <Link to="/login">Log in</Link>
      </span>

    </nav>
  </>)
}