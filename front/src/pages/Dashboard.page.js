import React, { useState } from "react";
import { withProtected } from "../lib/protectRoute.hoc"
import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"

import GridLayout from 'react-grid-layout';


const Grid = () => {
  const gridProps = {
    cols: 5,
    width: 800,
    rowHeight: 30,
    className: "layout"
  }


  const [layout, setLayout] = useState([
    { i: 'a', x: 0, y: 0, w: 1, h: 8, minH: 8 },
    { i: 'b', x: 1, y: 0, w: 2, h: 4, minH: 4 },
    { i: 'c', x: 5, y: 0, w: 1, h: 4, minH: 4 }
  ]
  )

  const handleAdd = () => {
    const newElement = { i: layout.length.toString(), x: (layout[layout.length - 1].x + 1) % gridProps.cols, y: 0, w: 1, h: 2, minH: 4 };
    console.log([...layout, newElement])
    setLayout([...layout, newElement])
  };

  const handleRemove = (e) => {
    //must remove also from database
    setLayout([...layout].filter(item => item != e))
  }

  const handleEdit = (e) => {
    console.log("edit", e)
  }


  return (<>
    <button onClick={handleAdd}>+</button>

    <GridLayout
      autoSize={true} layout={layout}
      {...gridProps}>
      {layout.map((e) =>
        <div className="dashboard-element" key={e.i}>
          <button onClick={() => handleRemove(e)}>x</button>
          <button onClick={handleEdit}>Edit</button>
          {e.i}blablablablablablablablablablablablablablablablablablablabla
        </div>)}
    </GridLayout>
  </>)
}

const Page = () => (
  <div>
    <h1> This is dashboard</h1>
    <Grid />
  </div>
);
export const DashboardPage = withProtected(Page);
