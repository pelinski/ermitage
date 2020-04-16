import React from "react";
import { Link } from "react-router-dom";
import { DeleteIcon, EditIcon, LockIcon, UnlockIcon } from "./Icons";
import { changeFolderPrivacy } from "../api/elements.api";


export const LinkButton = ({ to, children }) => (<button className="auth-button"><Link {...{ to }}>{children}</Link></button>)
export const FormButton = ({ children, type = "" }) => (<button {...{ type }}>{children}</button>)
export const Button = ({ to, children, className }) => (<button className={className || ""} ><Link {...{ to }}>{children}</Link></button>)

export const DeleteButton = ({ setOpen, open, element }) => (
  <button className="delete-item-button" onClick={() => setOpen({ ...open, alerts: { showAlert: true, remove: element } })}>
    <DeleteIcon />
  </button>)

export const EditButton = ({ onClick }) => (
  <button className="edit-item-button" onClick={onClick} >
    <EditIcon />
  </button >
)


export const ChangePrivacyButton = ({ folderBoard, open, setOpen }) => (
  < button onClick={() => { changeFolderPrivacy({ folderBoard: folderBoard.folder.name, isPrivate: !folderBoard.folder.isPrivate }).then(() => setOpen({ ...open, changes: !open.changes })) }} >
    {folderBoard.isPrivate ? <LockIcon /> : <UnlockIcon />}
  </button >
)