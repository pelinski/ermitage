import React, { useState, useEffect } from "react";
import { animated as Animated, useSpring } from "react-spring"
import { Link } from "react-router-dom"
import RGL, { WidthProvider } from "react-grid-layout";
import styled from "styled-components";

import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"

import { FieldNoLabel } from "../components/Form";
import { Collapsible } from "../components/Collapsible"

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
    }).finally(() => setChanges(false));
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


  const DeleteAlert = () => {
    return (
      <div className="delete-alert">
        <div>
          <p>
            Are you sure you want to delete the folder {alerts.remove.folder}? <br />
      You will lose all elements inside it.
    </p>
        </div>
        <div>
          <button onClick={() => {

            deleteFolder({ folder: alerts.remove }).then(() => {
              setAlerts({ ...alerts, showAlert: false, remove: "" });
              setChanges(!changes)
            });
            //handlePost({ fields: ["folder", "user"], data: alerts.remove, apiFunction: deleteFolder, setError, setChanges });

          }}>Yes</button>
          <button onClick={() => setAlerts({ ...alerts, showAlert: false, remove: "" })}>Cancel</button>
        </div>
      </div>
    )
  }


  return (
    <>
      <TitleWrapper>
        <h1>Folders</h1>
        <Collapsible trigger="Add folder"  {...{ open, setOpen }}>
          <form onSubmit={e => {
            e.preventDefault();
            handlePost({ fields: ["folder"], data, apiFunction: createFolder, setError, setChanges });
          }}>
            <FieldNoLabel field="folder" {...{ example: { folder: "Folder name" }, data }} handleInputChange={(e) => handleInputChange(e, data, setData)} className="add-folder-input" />
            {error}
          </form>
        </Collapsible>
      </TitleWrapper>

      <ReactGridLayout className="layout" layout={dashboard.layout} {...props.grid} onLayoutChange={(e) => onLayoutChange(e)}>

        {dashboard.folders.filter(e => !((e.user._id != user._id) && (e.isPrivate))).map((e, i) =>
          <Animated.div key={e._id} style={props.spring} className="folder grid-element" data-grid={{ w: 1, h: 3, x: i, y: 0 }}>
            <Folder setChanges={setChanges} deleteFolder={() => {
              setAlerts({ ...alerts, showAlert: true, remove: e });
            }}>
              <Link style={{ display: "inline-block", width: "80%" }} to={e.path}>{e.folder}</Link>
              {e.user._id != user._id && <p>by <em>{e.user.username}</em></p>}
            </Folder>
          </Animated.div>)}
      </ReactGridLayout>

      {alerts.showAlert && <DeleteAlert />}

    </>
  )
};

export const DashboardPage = withProtected(Page);
