import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import RGL, { WidthProvider } from "react-grid-layout";

import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"

import { Field } from "../components/Form";
import { FormButton } from "../components/Buttons"

import { getFolders, createFolder, deleteFolder, updateDashboardLayout, getDashboardLayout } from "../api/dashboard.api";
import { withProtected } from "../lib/protectRoute.hoc"
import { handleInputChange, handlePost } from "../lib/formHelpers";


const ReactGridLayout = WidthProvider(RGL);
const Folder = ({ children, deleteFolder, setChanges }) => (<>
<button onClick={() =>  deleteFolder()} className="folderDetail"> x </button>
<div className="folderContent">{children}</div>
</>)


const Page = () => {

  //Hooks
  const [error, setError] = useState("");
  const [changes, setChanges] = useState(true);
  const [dashboard,setDashboard] = useState({
    folders: [],
    layout: []
  });
  const [data, setData] = useState({
    folder: ""
  });



  useEffect(() => {
    Promise.all([getFolders(),getDashboardLayout()]).then(([foldersRes,layoutRes]) => {
      setDashboard({ ...dashboard, folders:foldersRes.data, layout:layoutRes.data })
    }).finally(()=>setChanges(false));}, [changes]); //when folder is added or deleted

  // Grid
  const gridProps = {
    cols: 8,
    rowHeight: 30,
  }


  const onLayoutChange = (newLayout) => {
    updateDashboardLayout({ layout:newLayout }).then(() => setDashboard({...dashboard, layout:newLayout}));
  }

  return (
    <>
      <h1> These are your folders</h1>

      <ReactGridLayout className="layout" layout={dashboard.layout} {...gridProps} onLayoutChange={(e)=>onLayoutChange(e)}>
        {dashboard.folders.map((e, i) =>
         
         <div key={i} className="folder" data-grid={{ w: 1, h: 3, x: i, y: 0 }}>
            <Folder setChanges={setChanges} deleteFolder={() =>
              handlePost({ fields: ["folder"], data: e, apiFunction: deleteFolder, setError, setChanges })}>
              <Link style={{ display: "inline-block", width: "80%" }} to={e.path}>{e.folder}</Link>
            </Folder>
          </div>)}


      </ReactGridLayout>
      <form onSubmit={e => {
        e.preventDefault();
        handlePost({ fields: ["folder"], data, apiFunction: createFolder, setError, setChanges });
      }}>
        <Field field="folder" {...{ example: { folder: "project" }, data }} handleInputChange={(e) => handleInputChange(e, data, setData)} />
        {error}
        <FormButton type="submit"> Add folder </FormButton>
      </form>

    </>
  )
};

export const DashboardPage = withProtected(Page);
