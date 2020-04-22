import React from "react";
import { Link, useLocation } from "react-router-dom";

import { useUser } from "../api/auth.api"
import logo from "../public/logo.svg"
import { LoggedinNav } from "../components/Nav"

export const Header = () => {
    const user = useUser();
    const isHome = useLocation().pathname == "/";
    console.log(isHome);
    if (isHome) {
        return (<header></header>)

    } else {

        return (
            <header>
                {!isHome && <Link to={`/`} className="link"> <img src={logo} width="110px" /></Link>}
                {user && <LoggedinNav />}
            </header>
        )
    }
}


