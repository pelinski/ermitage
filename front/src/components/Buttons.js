import React from "react";
import { Link } from "react-router-dom";
import { DeleteIcon, EditIcon, LockIcon, UnlockIcon } from "./Icons";
import { changeFolderPrivacy } from "../api/elements.api";


export const LinkButton = ({ to, children }) => (<button className="auth-button"><Link {...{ to }}>{children}</Link></button>)
export const FormButton = ({ children, type = "" }) => (<button {...{ type }}>{children}</button>)
export const Button = ({ to, children, className }) => (<button className={className || ""} ><Link {...{ to }}>{children}</Link></button>)

export const DeleteButton = ({ setAlerts, alerts, element }) => (
  <button className="delete-item-button" onClick={() => setAlerts({ ...alerts, showAlert: true, remove: element })}>
    <DeleteIcon />
  </button>)

export const EditButton = ({ onClick }) => (
  <button className="edit-item-button" onClick={onClick} >
    <EditIcon />
  </button >
)


export const ChangePrivacyButton = ({ folder, isPrivate, changes, setChanges }) => (
  < button onClick={() => { changeFolderPrivacy({ folder, isPrivate: !isPrivate }).then(() => setChanges(!changes)) }} >

    {isPrivate ? <LockIcon /> : <UnlockIcon />}
  </button >
)