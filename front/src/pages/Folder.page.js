import React, { useState, useEffect, useRef, createRef } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import styled from "styled-components"
import MultiRef from 'react-multi-ref';

import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"

import { AddItemCollapsible } from "../components/Collapsible"
import { FolderIcon, DeleteIcon } from "../components/Icons"
import { TextElement, ImageElement } from "../components/Elements"
import { TextEditor } from "../components/TextEditor"
import { DeleteAlert } from "../components/Alerts"
import { UploadImage } from "../components/AddFiles"

import { withProtected } from "../lib/protectRoute.hoc"
import { getText, removeElement, updateFolderLayout, getFolderLayout } from "../api/elements.api"

const ReactGridLayout = WidthProvider(RGL);

const TitleWrapper = styled.div`
display:flex;
align-items:center;
img {
  padding-right:10px;
}
`


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

  const gridProps = { cols: 8, rowHeight: 30, className: "layout", margin: [10, 10], containerPadding: [10, 10] }


  useEffect(() => {
    Promise.all([getText({ folder }), getFolderLayout({ folder })]).then(([elementsRes, layoutRes]) => {
      setFolderBoard({ ...folderBoard, elements: elementsRes.data, layout: layoutRes.data });

    })
  }, [changes]); //when folder is added or deleted*/

  const handleRemove = ({ element }) => { removeElement({ element }).then(() => setChanges(!changes)) }


  const onLayoutChange = (newLayout) => { updateFolderLayout({ folder, layout: newLayout }).then(() => setFolderBoard({ ...folderBoard, layout: newLayout })); }

  return (<>

    <TitleWrapper><FolderIcon /> <h1>{folder}</h1></TitleWrapper>
    <div className="menu">
      {open.text && <TextEditor {...{ changes, setChanges, open, setOpen, folder }} />}
      {open.image && <UploadImage {...{ changes, setChanges, open, setOpen, folder }} />}
      <AddItemCollapsible {...{ open, setOpen }} />
    </div>
    {alerts.showAlert && <DeleteAlert {...{ alerts, setAlerts, handleRemove }} />}
    <ReactGridLayout onLayoutChange={onLayoutChange} layout={folderBoard.layout} {...gridProps}>
      {folderBoard.elements.map((element, i) => (
        <div className="grid-element" ref={elementsRefs.ref(i)} key={element._id} data-grid={{ w: 1, h: 3, x: 1, y: 0 }}>
          <button onClick={() => { setAlerts({ ...alerts, showAlert: true, remove: element }) }}>
            <DeleteIcon />
          </button>
          {console.log(elementsRefs.map.get(i)?.getBoundingClientRect())}
          {element.type == "text" && <TextElement text={element.text} />}
          {element.type == "image" && <ImageElement image={element.image} width={elementsRefs.map.get(i)?.getBoundingClientRect().width || 500} />}
        </div>)
      )}
    </ReactGridLayout>
  </>)
}

export const FolderPage = withProtected(Page);