import React, { useState, useEffect } from "react";
import GridLayout from 'react-grid-layout';

import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"

import { Field } from "../components/Form";

import { withProtected } from "../lib/protectRoute.hoc"
import { uploadText, retrieveText } from "../lib/dashboard.api"


const Grid = ({folder}) => {
  //display elements
  const [elements, setElements] = useState([]);
  // save layout in folder
  const [layout, setLayout] = useState([]);
  // reload grid when element update
  const [changes,setChanges] = useState(true);
  // form control for add element field
  const [addField, setAddField] = useState({
    text: ""
  });

  
  useEffect(() => {
    retrieveText({folder}).then(e => { 
      setElements(e.data);
      setLayout(e.data.map(
        (e, i) => ({ i: i.toString(), x: i%gridProps.cols, y: 0, w: 1, h: 6, minH: 6 }))
        ) }).finally(() => setChanges(false))
  }, [changes])

  const gridProps = {
    cols: 5,
    width: 800,
    rowHeight: 30,
    className: "layout"
  }

/*
  const exampleLayout = [
    { i: 'a', x: 0, y: 0, w: 1, h: 8, minH: 8 },
    { i: 'b', x: 1, y: 0, w: 2, h: 4, minH: 4 },
    { i: 'c', x: 5, y: 0, w: 1, h: 4, minH: 4 }
  ]*/


  const handleAdd = () => {
    console.log({text:addField.text})
    uploadText({text: addField.text,folder}).then(setChanges(true));
  };

  const handleRemove = (e) => {
    //must remove also from database
    setLayout([...layout].filter(item => item != e))
  }

  const handleEdit = (e) => {
    console.log("edit", e)
  }

  //must store layout
  const onLayoutChange=(e) => {
    console.log("layoutchange",e)
    setLayout(e)
  }

  const handleInputChange = e => {
    const value = e.target.value;
    const name = e.target.name;
    setAddField({ ...addField, [name]: value });
  };

  return (<>

    Add item
    
    <Field field="text" {...{ example: "text input", data:addField, handleInputChange }} />
    <button onClick={handleAdd}>+</button>

    <GridLayout
      onLayoutChange={onLayoutChange}
      autoSize={true} layout={layout}
      {...gridProps}>
      {layout.map((e,i) =>
        <div className="dashboard-element" key={e.i}>
          <button onClick={() => handleRemove(e)}>x</button>
          <button onClick={handleEdit}>Edit</button>
          {e.i}{elements[i].text}
        </div>)}
    </GridLayout>
  </>)
}

const Page = ({folder}) => (
  <div>
     
    <h1> This is Folder {folder}</h1>
    <Grid {...{folder}}/>
  </div>
);
export const FolderPage = withProtected(Page);
