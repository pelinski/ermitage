import React, { useState, useEffect } from "react";
import { animated as Animated, useSpring } from "react-spring"
import { Link } from "react-router-dom"
import RGL, { WidthProvider } from "react-grid-layout";
import styled from "styled-components";

import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"

import { FieldNoLabel } from "../components/Form";
import { ProfileBanner } from "../components/ProfileBanner";
import { Collapsible } from "../components/Collapsible"
import { LockIcon, UnlockIcon } from "../components/Icons";


import { getFolders, createFolder, deleteFolder, updateDashboardLayout, getDashboardLayout } from "../api/dashboard.api";
import { withProtected } from "../lib/protectRoute.hoc"
import { handleInputChange, handlePost } from "../lib/formHelpers";
import { useUser } from "../api/auth.api";





const ReactGridLayout = WidthProvider(RGL);
const Folder = ({ children, deleteFolder }) => (<>
  <button onClick={() => deleteFolder()} className="folderDetail"> x </button>
  <div className="folderContent">{children}</div>
</>)
const TitleWrapper = styled.div`
display:flex;
justify-content:space-between;
`



const Page = () => {
  //Hooks
  const [alerts, setAlerts] = useState({
    remove: "",
    showAlert: false
  })
  const [error, setError] = useState("");
  const [changes, setChanges] = useState(true);
  const [open, setOpen] = useState(false);
  const [dashboard, setDashboard] = useState({
    folders: [],
    layout: []
  });
  const [data, setData] = useState({
    folder: ""
  });



  useEffect(() => {
    Promise.all([getFolders(), getDashboardLayout()]).then(([foldersRes, layoutRes]) => {
      setDashboard({ ...dashboard, folders: foldersRes.data, layout: layoutRes.data })
    });
  }, [changes]); //when folder is added or deleted


  const user = useUser();
  // Grid
  const props = {
    grid: {
      cols: 8,
      rowHeight: 30,
    },
    spring: useSpring({ opacity: 1, from: { opacity: 0 }, duration: 600 })
  }

  const onLayoutChange = (newLayout) => {
    updateDashboardLayout({ layout: newLayout }).then(() => setDashboard({ ...dashboard, layout: newLayout }));
  }



  return (
    <>
      <ProfileBanner {...{ user }} />
      <TitleWrapper>
        <h1>Folders</h1>
        <Collapsible trigger="Add folder"  {...{ open, setOpen }}>
          <form onSubmit={e => {
            e.preventDefault();
            handlePost({ fields: ["folder"], data, apiFunction: createFolder, setError, setChanges, changes });
          }}>
            <FieldNoLabel field="folder" {...{ example: { folder: "Folder name" }, data }} handleInputChange={(e) => handleInputChange(e, data, setData)} className="add-folder-input" />
            {error}
          </form>
        </Collapsible>
      </TitleWrapper >

      <ReactGridLayout className="layout" layout={dashboard.layout} {...props.grid} onLayoutChange={(e) => onLayoutChange(e)}>

        {dashboard.folders.filter((e) => {
          const isFolderFromUser = e.user.username == user.username;
          const isFolderPrivate = e.isPrivate;
          if (isFolderPrivate && !isFolderFromUser) {
            return false
          } else {
            return true
          }
        }).map((e, i) => {
          const isFolderFromUser = e.user.username == user.username;
          return (
            <Animated.div key={e._id} style={props.spring} className="folder grid-element" data-grid={{ w: 1, h: 3, x: i, y: 0 }}>
              <Folder setChanges={setChanges} deleteFolder={() => {
                setAlerts({ ...alerts, showAlert: true, remove: e });
              }}>
                {e.isPrivate ? <LockIcon /> : <UnlockIcon />}
                <Link style={{ display: "inline-block", width: "80%" }} to={e.path}>{e.folder}</Link>
                {!isFolderFromUser && <p>by <em>{e.user.username}</em></p>}
              </Folder>
            </Animated.div>
          )
        })


        }
      </ReactGridLayout>

      {alerts.showAlert && <DeleteAlert {...{ alerts, setAlerts, changes, setChanges }} />}

    </>
  )
};

export const DashboardPage = withProtected(Page);

const DeleteAlert = ({ alerts, setAlerts, changes, setChanges }) => (
  <div className="delete-alert">
    <div>
      <p>
        Are you sure you want to delete the folder {alerts.remove.folder}? <br />
    You will lose all elements inside it.
  </p>
    </div>
    <div>
      <button onClick={() => {
        deleteFolder({ folderId: alerts.remove._id }).then(() => {
          setAlerts({ ...alerts, showAlert: false, remove: "" });
          setChanges(!changes)
        });
      }}>Yes</button>
      <button onClick={() => setAlerts({ ...alerts, showAlert: false, remove: "" })}>Cancel</button>
    </div>
  </div>
)

