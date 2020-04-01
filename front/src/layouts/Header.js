import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useUser } from "../lib/auth.api"
import { LoggedinNav, VisitorNav } from "../components/Nav";

const Logo = styled.div`
font-size:16pt;
align-self:flex-end`


export const Header = () => {
    const user = useUser();
    return (
        <header>
            <Logo>
                <Link to="/"> Эж</Link>
            </Logo>
            {user && <LoggedinNav />}
            {!user && <VisitorNav />}

        </header>)
}