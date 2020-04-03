import React, { useState, useEffect } from "react";
import { withProtected } from "../lib/protectRoute.hoc"
import { getFolders, createFolder } from "../lib/dashboard.api";
import { Link } from "react-router-dom"
import { Field } from "../components/Form";
import { FormButton } from "../components/Buttons"


const Page = () => {
  const [folders, setFolders] = useState([]);
  const [data, setData] = useState({
    folder: ""
  });
  const [error, setError] = useState("");
  
  const handleInputChange = e => {
    const value = e.target.value;
    const name = e.target.name;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = () => {

    const {folder} = { ...data };
   
    createFolder({folder}).then((res) => {
      if (res.status != 200) {
        console.log(res)
        console.log(res.data.message)
        setError(res.data.message)
      }
      else {
        console.log(res.data.message);
      }
    }).catch(e => console.log(e))

  };


  useEffect(() => { getFolders().then(res => setFolders(res.data)) }, [])
  return (
    <div>
      <h1> These are your folders</h1>
      {folders.map((e, i) => <Link to={e.path} key={i}>{e.folder} </Link>)}

      <form onSubmit={e => {
        e.preventDefault();
        handleSubmit(data);
      }}>
        <Field field="folder" {...{ example: "project", data, handleInputChange }} />
      {error}
        <FormButton type="submit">
          Add folder
       </FormButton>
      </form>
    </div>
  )
};
export const DashboardPage = withProtected(Page);
