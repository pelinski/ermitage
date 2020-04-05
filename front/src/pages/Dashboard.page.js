import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import RGL, { WidthProvider } from "react-grid-layout";


import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"

import { Field } from "../components/Form";
import { FormButton } from "../components/Buttons"

import { withProtected } from "../lib/protectRoute.hoc"
import { getFolders, createFolder, deleteFolder, updateDashboardLayout, getDashboardLayout } from "../api/dashboard.api";

import { handleInputChange, handlePost } from "../lib/formHelpers";


const ReactGridLayout = WidthProvider(RGL);
const Folder = ({ children, deleteFolder, setChanges }) => (<><button onClick={() => { deleteFolder(); setChanges(true) }} className="folderDetail"> x </button><div className="folderContent">{children}</div></>)



const Page = () => {

  //Hooks
  const [folders, setFolders] = useState([]);
  const [layout, setLayout] = useState([]);
  const [error, setError] = useState("");
  const [changes, setChanges] = useState(false);
  const [data, setData] = useState({
    folder: ""
  });

  useEffect( () => {
    getDashboardLayout().then(res => { console.log("first layout charged", res.data); setLayout(res.data);}).finally(()=> {setChanges(true)})
  },[]);



  useEffect(() => {
    getFolders().then(res => {
      setFolders(res.data);
    }).finally(() => {
      setChanges(false)
    })
  }, [changes]);

  // Grid
  const gridProps = {
    cols: 8,
    rowHeight: 30,
  }

  const onLayoutChange = (layout) => {
    updateDashboardLayout({layout});
    setLayout(layout)
  }


  return (
    <>
      <h1> These are your folders</h1>

      <ReactGridLayout className="folderWrapper layout" layout={layout} {...gridProps} onLayoutChange={onLayoutChange}>
        {folders.map((e, i) =>
          <div key={i} className="folder"  data-grid={{ w: 1, h: 3, x: i, y: 0 }}>
            <Folder setChanges={setChanges} deleteFolder={() =>
              handlePost({ fields: ["folder"], data: folders[i], apiFunction: deleteFolder, setError, setChanges })}>
              <Link style={{ display: "inline-block", width: "80%" }} to={folders[i].path}>{folders[i].folder}</Link>
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
