import React, { useState, useEffect } from "react";
import styled from "styled-components";

import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"

import { FieldNoLabel } from "../components/Form";
import { ProfileBanner } from "../components/ProfileBanner";
import { Collapsible } from "../components/Collapsible"



import { getDashboard, createFolder, deleteFolder } from "../api/dashboard.api";
import { withProtected } from "../lib/protectRoute.hoc"
import { handleInputChange, handlePost } from "../lib/formHelpers";

import { DashboardGrid } from "../components/Grids";




const Page = ({ dashboardUsername }) => {
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
    layout: [],
    dashboardUsername,
    profileInfo: {
      profilePicId: "",
      bio: ""
    }
  });
  const [data, setData] = useState({
    folder: ""
  });

  useEffect(() => {
    getDashboard({ username: dashboardUsername }).then(res => { setDashboard({ ...dashboard, ...res.data }) })
  }, [changes, dashboardUsername]); //when folder is added or deleted


  return (
    <>
      <ProfileBanner {...{ dashboard, changes, setChanges }} />
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
      <DashboardGrid {...{ dashboard, setDashboard, setChanges, setAlerts }} />
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

const TitleWrapper = styled.div`
display:flex;
justify-content:space-between;
`
