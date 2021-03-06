import React, { useState, useEffect } from "react";
import { useSpring, animated as Animated } from 'react-spring'

import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"

import { FieldNoLabel } from "../components/Form";
import { ProfileBanner } from "../components/ProfileBanner";


import notfound_plane from "../public/404-hermitage.svg"


import { useUser } from "../api/auth.api"

import { getDashboard, createFolder, deleteFolder } from "../api/dashboard.api";
import { withProtected } from "../lib/protectRoute.hoc"
import { handleInputChange, handlePost } from "../lib/formHelpers";

import { DashboardGrid } from "../components/Grids";
import { OkIcon, DeleteIcon, FolderRemoveIcon, FolderAddIcon } from "../components/Icons";




const Page = ({ dashboardUsername }) => {
  const spring = { mass: 5, tension: 860, friction: 200 };

  const [fadeIn, setFadeIn] = useSpring(() => ({ opacity: 0, marginLeft: "200vw" }));

  //Hooks
  const [alerts, setAlerts] = useState({
    remove: "",
    showAlert: false
  })
  const [changes, setChanges] = useState(true);
  const [dashboard, setDashboard] = useState({
    folders: [],
    layout: [],
    dashboardUsername,
    profileInfo: {
      profilePicId: "",
      bio: ""
    },
    doesUserExist: true
  });

  useEffect(() => {
    getDashboard({ username: dashboardUsername }).then(res => { setDashboard({ ...dashboard, ...res.data }) }).then(() =>
      setFadeIn(() => ({ opacity: 1, marginLeft: "0vh", from: { opacity: 0, marginLeft: "60vw" }, duration: 800, config: spring }))
    )
  }, [changes, dashboardUsername]); //when folder is added or deleted

  return (
    <>
      <ProfileBanner {...{ dashboard, changes, setChanges, fadeIn }} />
      {dashboard.doesUserExist && < Folders {...{ changes, setChanges, fadeIn, dashboardUsername }} />}
      {alerts.showAlert && <DeleteAlert {...{ alerts, setAlerts, changes, setChanges }} />}
      {dashboard.doesUserExist && <DashboardGrid {...{ dashboard, setDashboard, setChanges, setAlerts, fadeIn }} />}
      {!dashboard.doesUserExist && <div className="not-found-plane"> <img src={notfound_plane} /></div>}

    </>
  )
};

const Folders = ({ changes, setChanges, dashboardUsername }) => {
  const { username } = useUser();
  const isUserDashboardOwner = username == dashboardUsername;
  const [data, setData] = useState({
    folder: ""
  });
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");

  return (<>
    <div className="folders-wrapper">
      <div></div>
      <div>
        {isUserDashboardOwner && <AddFolderCollapsible  {...{ open, setOpen }}>
          <form onSubmit={e => {
            e.preventDefault();
            handlePost({ fields: ["folder"], data, apiFunction: createFolder, setError, setChanges, changes });
          }}>
            <FieldNoLabel field="folder" {...{ example: { folder: "Folder name" }, data }} handleInputChange={(e) => handleInputChange(e, data, setData)} className="add-folder-input" />

          </form>
        </AddFolderCollapsible>}
        {(error && open) && <p className="add-folder-error">{error}</p>}
      </div>
    </div>

  </>)
}



export const DashboardPage = withProtected(Page);

const DeleteAlert = ({ alerts, setAlerts, changes, setChanges }) => (
  <div className="delete-alert">
    <div>
      <p>
        Are you sure you want to delete folder {alerts.remove.folder}? <br />
    You will lose all elements inside it.
  </p>
    </div>
    <div>
      <button onClick={() => {
        deleteFolder({ folderId: alerts.remove._id }).then(() => {
          setAlerts({ ...alerts, showAlert: false, remove: "" });
          setChanges(!changes)
        });
      }}><OkIcon /></button>
      <button onClick={() => setAlerts({ ...alerts, showAlert: false, remove: "" })}><DeleteIcon /></button>
    </div>
  </div>
)


const AddFolderCollapsible = ({ children, open, setOpen }) => (
  <div className="Collapsible add-folder">
    {open && children}
    {open && <button className="trigger" onClick={() => setOpen(!open)}><FolderRemoveIcon /> </button>}
    {!open && <button className="trigger" onClick={() => setOpen(!open)}><FolderAddIcon /> </button>}
  </div>)