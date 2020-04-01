import React from "react";
import { Link } from "react-router-dom";


export const LinkButton = ({to,children}) => (<button><Link {...{to}}>{children}</Link></button>)
export const FormButton = ({children,type="",handleSubmit}) => (<button {...{type}} onSubmit={handleSubmit}>{children}</button>)
