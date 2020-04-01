import React from "react";
import styled from "styled-components";
import {Link} from "react-router-dom";

const HeaderStyles = styled.header`
display:flex;
`
const Logo = styled.div`
font-size:16pt`


export const Header = () => (
<HeaderStyles>
    <Logo>
        <Link to="/"> Эж</Link>
    </Logo>
     <nav>
         Here is a nav
     </nav>
</HeaderStyles>)