import React from "react";
import { ElementIcon, ElementCloseIcon, AudioIcon, TextIcon, CameraIcon } from "./Icons";


export const Collapsible = ({ children, trigger, open, setOpen }) => (
  <div className="Collapsible">
    <button className="trigger" onClick={() => setOpen(!open)}>{trigger}</button>
    {open && children}
  </div>)


export const AddItemCollapsible = ({ open, setOpen }) => (
  <div className="add-item">
    <div className="Collapsible">
      <button className="trigger" onClick={() => setOpen({ ...open, main: !open.main })}>
        {open.main || <ElementIcon />}
        {open.main && <ElementCloseIcon />}
      </button>

      {open.main && <AudioIcon />}
      {open.main && <TextIcon {...{ open, setOpen }} />}
      {open.main && <CameraIcon {...{ open, setOpen }} />}

    </div>
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






