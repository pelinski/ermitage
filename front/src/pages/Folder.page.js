import React, { useState, useEffect } from "react";
import { withProtected } from "../lib/protectRoute.hoc"
import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"

import GridLayout from 'react-grid-layout';

import { uploadText, retrieveText } from "../lib/dashboard.api"


const Grid = ({folder}) => {
  const [elements, setElements] = useState([]);
  const [layout, setLayout] = useState([]);
  const [changes,setChanges] = useState(true);
  useEffect(() => {
    retrieveText().then(e => { 
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


  const exampleLayout = [
    { i: 'a', x: 0, y: 0, w: 1, h: 8, minH: 8 },
    { i: 'b', x: 1, y: 0, w: 2, h: 4, minH: 4 },
    { i: 'c', x: 5, y: 0, w: 1, h: 4, minH: 4 }
  ]


  const handleAdd = () => {
    uploadText({text:"hi"}).then(setChanges(true))
  };

  const handleRemove = (e) => {
    //must remove also from database
    setLayout([...layout].filter(item => item != e))
  }

  const handleEdit = (e) => {
    console.log("edit", e)
  }
  const onLayoutChange=(e) => {
    console.log("layoutchange",e)
    setLayout(e)
  }



  return (<>
    <button onClick={handleAdd}>+</button>
{folder}
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
