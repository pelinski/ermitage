import React, { useState } from "react"

import { ElementIcon, ElementCloseIcon, AudioIcon, TextIcon, CameraIcon } from "./Icons";
import { SignupPage } from "../pages/Signup.page"
import { LoginPage } from "../pages/Login.page"




export const Collapsible = ({ children, trigger, open, setOpen }) => (
  <div className="Collapsible">
    <button className="trigger" onClick={() => setOpen(!open)}>{trigger}</button>
    {open && children}
  </div>)

export const CollapsibleAuth = () => {
  const [open, setOpen] = useState({ login: false, signup: false });

  return (
    <div className="Collapsible">
      {!open.login && <button className="trigger" onClick={() => setOpen({ ...open, signup: !open.signup })}>{!open.signup && "Join now"}{open.signup && "x"}</button>}
      {open.signup && <SignupPage />}
      {!open.signup && <button className="trigger" onClick={() => setOpen({ ...open, login: !open.login })}>{!open.login && "Log in"}{open.login && "x"}</button>}
      {open.login && <LoginPage />}
    </div>)
}


export const AddItemCollapsible = ({ open, setOpen }) => (

  <div className="add-item">
    <div className="Collapsible">
      <button className="trigger" onClick={() => setOpen({ ...open, main: !open.main })}>
        {open.main || <ElementIcon />}
        {open.main && <ElementCloseIcon />}
      </button>
      {open.main && <AudioIcon {...{ open, setOpen }} />}
      {open.main && <TextIcon {...{ open, setOpen }} />}
      {open.main && <CameraIcon {...{ open, setOpen }} />}


    </div>
  </div>
)

