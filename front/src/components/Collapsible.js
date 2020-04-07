import React from "react";
import { ElementIcon, ElementCloseIcon } from "./Icons";


export const Collapsible = ({ children, trigger, open, setOpen }) => (
  <div className="Collapsible">
    <button className="trigger" onClick={() => setOpen(!open)}>{trigger}</button>
    {open && children}
  </div>)


export const AddItemCollapsible = ({ children, open, setOpen }) => (
  <div className="Collapsible">
    <button className="trigger" onClick={() => setOpen(!open)}>

      {open || <ElementIcon />}
      {open && <ElementCloseIcon />}
    </button>
    {open && children}
  </div>)