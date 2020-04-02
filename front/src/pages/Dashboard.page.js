import React, { useState, useEffect } from "react";
import { withProtected } from "../lib/protectRoute.hoc"
import { getFolders } from "../lib/dashboard.api";
import {Link} from "react-router-dom"

const Page = () =>{ 
  const [folders,setFolders] = useState([]);

  useEffect ( () => {getFolders().then(res => setFolders(res.data) ) } ,[] )
  return (
  <div>
    <h1> These are your folders</h1>
    {folders.map((e,i) => <Link to={e.path} key={i}>{e.folder} </Link>)}
  </div>
)};
export const DashboardPage = withProtected(Page);
