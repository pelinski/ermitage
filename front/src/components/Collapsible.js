import React from "react";
import { ElementIcon, ElementCloseIcon, TextIcon } from "./Icons";
import { Editor, EditorState } from 'draft-js';


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

/*

export const CollapsibleHOC = (Icon, Component) => ({ open, setOpen }) => (
<div className="Collapsible">
  <button className="trigger" onClick={() => setOpen(!open)}>
    {open && <Icon />}
  </button>
  {open && <Component />}
</div>
);*/






