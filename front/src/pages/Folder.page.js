import React, { useState, useEffect } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import MultiRef from 'react-multi-ref';

import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"

import { AddItemCollapsible } from "../components/Collapsible"
import { FolderIcon, DeleteIcon } from "../components/Icons"
import { TextElement, ImageElement, AudioElement } from "../components/Elements"
import { TextEditor } from "../components/TextEditor"
import { DeleteAlert } from "../components/Alerts"
import { UploadImage, UploadAudio } from "../components/AddFiles"

import { withProtected } from "../lib/protectRoute.hoc"
import { getElements, removeElement, updateFolderLayout, getFolderLayout } from "../api/elements.api"

const ReactGridLayout = WidthProvider(RGL);

const Page = ({ folder }) => {
  const [elementsRefs] = useState(() => new MultiRef());
  const [open, setOpen] = useState({
    main: false,
    text: false,
    audio: false,
    images: false
  })
  const [changes, setChanges] = useState(true);

  const [folderBoard, setFolderBoard] = useState({
    elements: [],
    layout: []
  });
  const [alerts, setAlerts] = useState({
    remove: {},
    showAlert: false
  })

  const gridProps = { cols: 8, rowHeight: 30, className: "layout", useCSSTransforms: true, margin: [10, 10], containerPadding: [10, 10] }


  useEffect(() => {
    Promise.all([getElements({ folder }), getFolderLayout({ folder })]).then(([elementsRes, layoutRes]) => {
      setFolderBoard({ ...folderBoard, elements: elementsRes.data, layout: layoutRes.data });

    })
  }, [changes]); //when folder is added or deleted*/

  const handleRemove = ({ element }) => { removeElement({ element }).then(() => setChanges(!changes)) }


  const onLayoutChange = (newLayout) => { updateFolderLayout({ folder, layout: newLayout }).then(() => setFolderBoard({ ...folderBoard, layout: newLayout })); }

  return (<>

    <div className="page-title">
      <FolderIcon />
      <h1>{folder}</h1>
      <AddItemCollapsible {...{ open, setOpen }} />
    </div>

    <div className="menu">
      {open.text && <TextEditor {...{ changes, setChanges, open, setOpen, folder }} />}
      {open.image && <UploadImage {...{ changes, setChanges, open, setOpen, folder }} />}
      {open.audio && <UploadAudio {...{ changes, setChanges, open, setOpen, folder }} />}

    </div>
    {alerts.showAlert && <DeleteAlert {...{ alerts, setAlerts, handleRemove }} />}

    <ReactGridLayout onLayoutChange={onLayoutChange} layout={folderBoard.layout} {...gridProps}>
      {folderBoard.elements.map((element, i) => (
        <div className={`grid-element ${element?.type && "element-" + element.type}`} ref={elementsRefs.ref(i)} key={element._id} data-grid={{ w: 1, h: 3, x: 1, y: 0 }} >
          <div>
            <button className="delete-item-button" onClick={() => { setAlerts({ ...alerts, showAlert: true, remove: element }) }}>
              <DeleteIcon />
            </button>
            {element.type == "text" && <TextElement text={element.text} />}
            {element.type == "image" && <ImageElement image={element.image} size={elementsRefs.map.get(i)?.getBoundingClientRect()} />}
            {element.type == "audio" && <AudioElement audio={element.audio} size={elementsRefs.map.get(i)?.getBoundingClientRect()} />}

          </div>
        </div>)
      )}
    </ReactGridLayout >

  </>)
}

export const FolderPage = withProtected(Page);