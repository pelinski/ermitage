import React from "react";
import { Link } from "react-router-dom";


export const LinkButton = ({ to, children }) => (<button className="auth-button"><Link {...{ to }}>{children}</Link></button>)
export const FormButton = ({ children, type = "" }) => (<button {...{ type }}>{children}</button>)
export const Button = ({ to, children }) => (<button className="home-button"><Link {...{ to }}>{children}</Link></button>)



