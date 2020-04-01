import React, { useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useUser } from "../lib/auth.api"

const HeaderStyles = styled.header`
display:flex;
`
const Logo = styled.div`
font-size:16pt`


export const Header = () => {
    const user = useUser();
    return (
        <HeaderStyles>
            <Logo>
                <Link to="/"> Эж</Link>
            </Logo>
            {user && user.username}
            <nav>
                Here is a nav
            </nav>
        </HeaderStyles>)
}