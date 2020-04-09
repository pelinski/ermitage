import React from "react"
import {LinkButton} from "../components/Buttons"

import logo from "../public/home-logo.svg"

export const HomePage = () => (
<>
<img src={logo}/>
<LinkButton to="/signup">Sign up</LinkButton>
<LinkButton to="/login">Login</LinkButton>

</>);