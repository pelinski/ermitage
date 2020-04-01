import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import {border} from "../styles/mainStyles"

const ButtonStyle = styled.button`
width: 100px;
padding: 5px 5px;
display:flex;
justify-content:center;
margin:10px;
border: ${border};
`

export const LinkButton = ({to,children}) => (<ButtonStyle><Link {...{to}}>{children}</Link></ButtonStyle>)
export const FormButton = ({children,type=""}) => (<ButtonStyle {...{type}}>{children}</ButtonStyle>)
