import React from "react"

import { ElementIcon, ElementCloseIcon, AudioIcon, TextIcon, CameraIcon, FolderAddIcon, FolderRemoveIcon } from "./Icons";





export const AddFolderCollapsible = ({ children, open, setOpen }) => (
  <div className="Collapsible add-folder">
    {open && children}
    {open && <button className="trigger" onClick={() => setOpen(!open)}><FolderRemoveIcon /> </button>}
    {!open && <button className="trigger" onClick={() => setOpen(!open)}><FolderAddIcon /> </button>}

  </div>)


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

