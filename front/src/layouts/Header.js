import React from "react";


import logo from "../public/logo.svg"
import { Link } from "react-router-dom";
import { useUser } from "../api/auth.api"
import { LoggedinNav } from "../components/Nav";



export const Header = () => {
    const user = useUser();

    return (
        <header style={{ overflow: "hidden" }}>
            {user && <Link to={`/${user.username}/dashboard`} className="link"> <img src={logo} height="40px" /></Link>}
            {user && <LoggedinNav />}

        </header>
    )
}