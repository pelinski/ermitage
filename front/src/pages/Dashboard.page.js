import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"
import GridLayout from 'react-grid-layout';

import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"

import { Field } from "../components/Form";
import { FormButton } from "../components/Buttons"

import { withProtected } from "../lib/protectRoute.hoc"
import { getFolders, createFolder } from "../lib/dashboard.api";

import { handleInputChange, handleSubmit } from "../lib/formHelpers";

const Folder = ({ children,deleteFolder }) => (<><div className="folderDetail" onClick={deleteFolder}> x </div><div className="folderContent">{children}</div></>)



const Page = () => {

  //Hooks

  const [folders, setFolders] = useState([]);
  const [layout, setLayout] = useState([]);
  const [error, setError] = useState("");
  const [changes, setChanges] = useState(true);

  const [data, setData] = useState({
    folder: ""
  });


  useEffect(() => { getFolders().then(res => {
    setFolders(res.data);
    console.log(res.data)
    setLayout(res.data.map((e, i) => ({ i: i.toString(), x: i%gridProps.cols, y: 0, w: 1, h: 3 })))
    console.log(res.data.map((e, i) => ({ i: i.toString(), x: i%gridProps.cols, y: 0, w: 1, h: 6 })))}
    ).finally(() =>setChanges(false)) }, [changes]);

  // Grid
  const gridProps = {
    cols: 5,
    width: 800,
    rowHeight: 30,
    className: "layout"
  }
  
  const onLayoutChange=(e) => {
    console.log("layoutchange",e)
    setLayout(e)
  }


  return (
    <>
      <h1> These are your folders</h1>

      <GridLayout className="folderWrapper" onLayoutChange={onLayoutChange} autoSize={true} layout={layout} {...gridProps}>
          {layout.map((e, i) => <div key={e.i} className="folder" ><Folder> <Link to={folders[i].path}>{folders[i].folder}</Link></Folder> </div>)}
      </GridLayout>
      <form onSubmit={e => {
        e.preventDefault();
        handleSubmit({ fields: ["folder"], data, apiFunction: createFolder, setError, setChanges });
      }}>
        <Field field="folder" {...{ example: { folder: "project" }, data }} handleInputChange={(e) => handleInputChange(e, data, setData)} />
        {error}
        <FormButton type="submit"> Add folder </FormButton>
      </form>

    </>
  )
};

export const DashboardPage = withProtected(Page);
