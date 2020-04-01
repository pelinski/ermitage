import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import {border} from "../styles/mainStyles"

const ButtonStyle = styled.div`
width: 100px;
padding: 5px 5px;
display:flex;
justify-content:center;
margin:10px;
border: ${border};
`

export const Button = ({to,children}) => (<ButtonStyle><Link {...{to}}>{children}</Link></ButtonStyle>)
