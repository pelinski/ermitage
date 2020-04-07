import React, { useState, useEffect, useRef } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import styled from "styled-components"

//import { Editor, EditorState, RichUtils } from 'draft-js';
//import { stateToHTML } from 'draft-js-export-html';

import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"
//import "/node_modules/draft-js/dist/Draft.css"

import { AddItemCollapsible } from "../components/Collapsible"
import { AudioIcon, FolderIcon, TextIcon, ElementIcon, DeleteIcon, CameraIcon } from "../components/Icons"
import { TextElement } from "../components/Elements"
import { TextEditor } from "../components/TextEditor"

import { withProtected } from "../lib/protectRoute.hoc"
import { getText, removeText, updateFolderLayout, getFolderLayout } from "../api/elements.api"

const ReactGridLayout = WidthProvider(RGL);
const TitleWrapper = styled.div`
display:flex;
align-items:center;
img {

  padding-right:10px;
}
`


const Page = ({ folder }) => {
  const [open, setOpen] = useState(false)
  const [changes, setChanges] = useState(true);

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


  const handleRemove = ({ id }) => {
    removeText({ id }).then(() => setChanges(!changes))
  }


  const onLayoutChange = (newLayout) => {
    updateFolderLayout({ folder, layout: newLayout }).then(() => setFolderBoard({ ...folderBoard, layout: newLayout }));
  }

  return (<>
    <TitleWrapper>

      <FolderIcon /> <h1>{folder}</h1>
    </TitleWrapper>

    <TextEditor {...{ changes, setChanges, folder }} />

    <div className="add-item">
      <AddItemCollapsible {...{ open, setOpen }}>

        <AudioIcon />
        <TextIcon />
        <CameraIcon />

      </AddItemCollapsible>
    </div>


    <ReactGridLayout onLayoutChange={onLayoutChange} layout={folderBoard.layout} {...gridProps}>

      {folderBoard.elements.map((element, i) => {
        return (
          <div className="grid-element" key={element._id} data-grid={{ w: 1, h: 3, x: 1, y: 0 }}>
            <button onClick={() => {
              setAlerts({ ...alerts, showAlert: true, remove: element._id });
            }}>
              <DeleteIcon />
            </button>

            {element.type == "text" && <TextElement text={element.text} />}
          </div>)
      })}
    </ReactGridLayout>

    {alerts.showAlert && <DeleteAlert />}

  </>)
}

export const FolderPage = withProtected(Page);
