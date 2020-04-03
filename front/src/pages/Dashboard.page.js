import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"

import { Field } from "../components/Form";
import { FormButton } from "../components/Buttons"

import { withProtected } from "../lib/protectRoute.hoc"
import { getFolders, createFolder } from "../lib/dashboard.api";

import { handleInputChange, handleSubmit } from "../lib/formHelpers";

const Folder = ({ children }) => (<div className="folder"><div className="folderDetail" /><div className="folderContent">{children}</div></div>)


const Page = () => {
  const [folders, setFolders] = useState([]);
  const [error, setError] = useState("");
  const [changes,setChanges] = useState(true);
  const [data, setData] = useState({
    folder: ""
  });

  useEffect(() => { getFolders().then(res => setFolders(res.data)).finally(setChanges(false)) }, [changes]);


  return (
    <>
      <h1> These are your folders</h1>


      <div className="folderWrapper">
        {folders.map((e, i) => <Link to={e.path} key={i} ><Folder> {e.folder} </Folder> </Link>)}
      </div>


      <form onSubmit={e => {
        e.preventDefault();
        handleSubmit({ fields: ["folder"], data, apiFunction: createFolder, setError,setChanges });
      }}>
        <Field field="folder" {...{ example: { folder: "project" }, data }} handleInputChange={(e) => handleInputChange(e, data, setData)} />
        {error}
        <FormButton type="submit"> Add folder </FormButton>
      </form>

    </>
  )
};

export const DashboardPage = withProtected(Page);
