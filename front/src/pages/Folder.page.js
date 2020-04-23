import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";

import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"

import { AddItemCollapsible } from "../components/AddFiles"
import { FolderIcon, OkIcon, DeleteIcon } from "../components/Icons"
import { TextEditor } from "../components/TextEditor"
import { UploadImage, UploadAudio } from "../components/AddFiles"
import { FolderGridOwner, FolderGridVisitor } from "../components/Grids"
import { ChangePrivacyButton } from "../components/Buttons";

import { withProtected } from "../lib/protectRoute.hoc"
import { getFolder, removeElement } from "../api/elements.api"
import { addFolderToDashboard, deleteFolder, getDashboard } from "../api/dashboard.api"
import { useUser } from "../api/auth.api"



const Page = withRouter(({ history, folder, folderUsername }) => {

  const user = useUser();

  //changes and collapsibles
  const [open, setOpen] = useState({
    main: false,
    text: false,
    textEdit: { state: false, element: null },
    audio: false,
    images: false,
    alerts: {
      remove: {},
      showAlert: false
    },
    changes: true
  })

  //static once loaded
  const [folderBoard, setFolderBoard] = useState({
    elements: [],
    layout: [],
    isPrivate: null,
    folderId: "",
    folder: { name: folder, user: folderUsername }
  });

  useEffect(() => {
    getFolder({ folder, folderUsername }).then((res) => { setFolderBoard({ ...folderBoard, ...res.data }); })
  }, [open.changes]); //when folder is added or deleted*/


  const handleRemove = ({ element }) => { removeElement({ element }).then(() => setOpen({ ...open, changes: !open.changes })) }

  if (user.username == folderUsername) {
    return (<>
      <PageTitle {...{ open, setOpen, folder, isPrivate: folderBoard.isPrivate, folderBoard }} />
      <AddItemDashboard {...{ open, setOpen, folder }} />
      {open.alerts.showAlert && <DeleteAlert {...{ open, setOpen, handleRemove }} />}
      <FolderGridOwner {...{ folderBoard, setFolderBoard, open, setOpen }} />
    </>)
  } else if (user.username != folderUsername && folderBoard.isPrivate == false) {
    return (<>
      <PageTitle {...{ open, setOpen, folder: folderBoard.folder.name, isPrivate: folderBoard.isPrivate, visitor: true, folderUsername, user, folderBoard }} />
      <FolderGridVisitor {...{ folderBoard }} />

    </>)
  } else {
    history.push("/")
    return (<></>)
  }
})


export const FolderPage = withProtected(Page);


const AddItemDashboard = ({ open, setOpen, folder }) =>
  (<div className="menu">
    {open.text && <TextEditor {...{ open, setOpen, folder }} />}
    {open.textEdit.state && <TextEditor {...{ open, setOpen, folder, edit: true }} />}
    {open.image && <UploadImage {...{ open, setOpen, folder }} />}
    {open.audio && <UploadAudio {...{ open, setOpen, folder }} />}
  </div>)


const PageTitle = ({ open, setOpen, visitor = false, folderBoard }) => {
  const [userFolders, setUserFolders] = useState();
  const user = useUser();
  useEffect(() => { getDashboard({ username: user.username }).then(res => setUserFolders(res.data.folders.map(e => e._id))) }
    , [open.changes]) // get updated folders from user: getting them from context does not work because context only loads when page refreshes
  return (
    < div className="page-title" >
      <div className="col"><FolderIcon />
        <h1>{folderBoard.folder.name}</h1>
        {visitor && <p>by {folderBoard.folder.user}</p>}
        {visitor && !userFolders?.includes(folderBoard.folderId) && <button onClick={() => addFolderToDashboard({ folderId: folderBoard.folderId }).then(() => setOpen({ ...open, changes: !open.changes }))}>Add to your folders</button>}
        {visitor && userFolders?.includes(folderBoard.folderId) && <button onClick={() => deleteFolder({ folderId: folderBoard.folderId }).then(() => setOpen({ ...open, changes: !open.changes }))}>Remove folder from your dashboard</button>}
        {!visitor && <ChangePrivacyButton {...{ folderBoard, open, setOpen }} />}
      </div>
      <div className="col">
        {!visitor && <AddItemCollapsible {...{ open, setOpen, folder: folderBoard.folder.name }} />}</div>
    </div >
  )
}

const DeleteAlert = ({ open, setOpen, handleRemove }) => {
  return (
    <div className="delete-alert">
      <div>
        <p>
          Are you sure you want to delete this element? <br />
    You cannot undo this.
  </p>
      </div>
      <div>
        <button onClick={() => {
          handleRemove({ element: open.alerts.remove })
          setOpen({ ...open, alerts: { showAlert: false, remove: "" } });
        }}><OkIcon /></button>
        <button onClick={() => setOpen({ ...open, alerts: { showAlert: false, remove: "" } })}><DeleteIcon /></button>
      </div>
    </div>
  )
}