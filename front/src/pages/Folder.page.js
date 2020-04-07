import React, { useState, useEffect } from "react";
import RGL, { WidthProvider } from "react-grid-layout";

import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"

import { Field } from "../components/Form";
import { Collapsible } from "../components/Collapsible"


import { withProtected } from "../lib/protectRoute.hoc"
import { uploadText, getText, removeText, updateFolderLayout, getFolderLayout } from "../api/elements.api"
import { handleInputChange } from "../lib/formHelpers";

const ReactGridLayout = WidthProvider(RGL);


const Page = ({ folder }) => {
  const [open, setOpen] = useState(false)
  const [changes, setChanges] = useState(true);
  const [data, setData] = useState({
    text: ""
  });
  const [folderBoard, setFolderBoard] = useState({
    elements: [],
    layout: []
  });
  const [alerts, setAlerts] = useState({
    remove: {},
    showAlert: false
  })

  const gridProps = {
    cols: 8,
    rowHeight: 30,
    className: "layout"
  }

  const DeleteAlert = () => {
    return (
      <div className="delete-alert">
        <div>
          <p>
            Are you sure you want to delete the element {alerts.remove.e}? <br />
      You cannot undo this.
    </p>
        </div>
        <div>
          <button onClick={() => {
            handleRemove({ id: alerts.remove })
            setAlerts({ ...alerts, showAlert: false, remove: "" });
          }}>Yes</button>
          <button onClick={() => setAlerts({ ...alerts, showAlert: false, remove: "" })}>Cancel</button>
        </div>
      </div>
    )
  }


  useEffect(() => {
    Promise.all([getText({ folder }), getFolderLayout({ folder })]).then(([elementsRes, layoutRes]) => {
      setFolderBoard({ ...folderBoard, elements: elementsRes.data, layout: layoutRes.data });
    })
  }
    , [changes]); //when folder is added or deleted*/



  const handleAdd = () => {
    uploadText({ text: data.text, folder }).then(() => setChanges(!changes));
  };

  const handleRemove = ({ id }) => {
    removeText({ id }).then(() => setChanges(!changes))
  }


  const onLayoutChange = (newLayout) => {
    updateFolderLayout({ folder, layout: newLayout }).then(() => setFolderBoard({ ...folderBoard, layout: newLayout }));
  }

  return (<>
    <h1>{folder}</h1>
    <div className="add-item">
      <Collapsible trigger="Add item" {...{ open, setOpen }}>
        <Field field="text" {...{ example: "text input", data }} handleInputChange={(e) => handleInputChange(e, data, setData)} />
        <button onClick={handleAdd}>+</button>
      </Collapsible>
    </div>

    <ReactGridLayout onLayoutChange={onLayoutChange} layout={folderBoard.layout} {...gridProps}>

      {folderBoard.elements.map((element, i) => {
        return (
          <div className="grid-element" key={element._id} data-grid={{ w: 1, h: 3, x: 1, y: 0 }}>
            <button onClick={() => {
              setAlerts({ ...alerts, showAlert: true, remove: element._id });
            }}>x</button>

            {element.text}
          </div>)
      })}
    </ReactGridLayout>
    {alerts.showAlert && <DeleteAlert />}

  </>)
}

export const FolderPage = withProtected(Page);
