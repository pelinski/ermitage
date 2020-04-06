import React, { useState, useEffect } from "react";
import RGL, { WidthProvider } from "react-grid-layout";

import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"

import { Field } from "../components/Form";
import { FormButton } from "../components/Buttons"

import { withProtected } from "../lib/protectRoute.hoc"
import { uploadText, getText, removeText, updateFolderLayout, getFolderLayout } from "../api/elements.api"
import { handleInputChange} from "../lib/formHelpers";

const ReactGridLayout = WidthProvider(RGL);

const Page = ({folder}) => {
  const [changes,setChanges] = useState(true);
  const [data, setData] = useState({
    text: ""
  });
  const [folderBoard,setFolderBoard] = useState({
    elements: [],
    layout: []
  });
  

  useEffect(() => {
    Promise.all([getText({folder}),getFolderLayout({folder})]).then(([elementsRes,layoutRes]) => {
      console.log("layoutres", layoutRes.data)
      setFolderBoard({ ...folderBoard, elements:elementsRes.data, layout:layoutRes.data});
    })}
    , [changes]); //when folder is added or deleted*/

  const gridProps = {
    cols: 8,
    rowHeight: 30,
    className:"layout"
  }

  const handleAdd = () => {
    uploadText({text: data.text,folder}).then(()=>setChanges(!changes));
  };

  const handleRemove = ({id, layoutItem}) => {
    console.log("removeElement") 
    const newLayout = folderBoard.layout.filter(e => e!=layoutItem);
    Promise.all([ removeText({id}), updateFolderLayout({ folder, layout: newLayout })]).then(() =>
    setChanges(!changes));
  }

/*
  const handleEdit = (e) => {
    console.log("edit", e)
  }
*/

  const onLayoutChange=(newLayout) => {
    updateFolderLayout({ folder, layout: newLayout }).then(() => setFolderBoard({...folderBoard, layout:newLayout}));
  }

  return (<>
   <h1> This is Folder {folder}</h1>

    Add item
    
    <Field field="text" {...{ example: "text input", data }} handleInputChange={(e)=> handleInputChange(e,data,setData)} />
    <button onClick={handleAdd}>+</button>

    <ReactGridLayout onLayoutChange={onLayoutChange} layout={folderBoard.layout} {...gridProps}>

      {folderBoard.elements.map((element,i) => { 
        return (
        <div className="dashboard-element" key={element._id}  data-grid={{ w: 1, h: 3, x: 1, y: 0 }}>
          <button onClick={()=>{ 
  
          handleRemove({id:element._id, layoutItem:folderBoard.layout[i] })}}>x</button>
          <button>Edit</button>
          {element.text}
        </div>)
      })}
    </ReactGridLayout>
  </>)
}

export const FolderPage = withProtected(Page);
