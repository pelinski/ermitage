import React, { useState, useEffect } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import MultiRef from 'react-multi-ref';

import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"

import { AddItemCollapsible } from "../components/Collapsible"
import { FolderIcon } from "../components/Icons"
import { TextElement, ImageElement, AudioElement } from "../components/Elements"
import { TextEditor } from "../components/TextEditor"
import { DeleteAlert } from "../components/Alerts"
import { UploadImage, UploadAudio } from "../components/AddFiles"

import { withProtected } from "../lib/protectRoute.hoc"
import { getElements, removeElement, updateFolderLayout, getFolderLayout } from "../api/elements.api"
import { DeleteButton, EditButton, ChangePrivacyButton } from "../components/Buttons";

const ReactGridLayout = WidthProvider(RGL);

const Page = ({ folder }) => {
  //TO DO: MERGE STATES 

  const [elementsRefs] = useState(() => new MultiRef());
  const [open, setOpen] = useState({
    main: false,
    text: false,
    textEdit: { state: false, element: null },
    audio: false,
    images: false
  })
  const [changes, setChanges] = useState(true);

  const [folderBoard, setFolderBoard] = useState({
    elements: [],
    layout: [],
    isPrivate: null
  });
  const [alerts, setAlerts] = useState({
    remove: {},
    showAlert: false
  })


  const gridProps = { cols: 8, rowHeight: 30, className: "layout", useCSSTransforms: true, margin: [10, 10], containerPadding: [10, 10] }


  useEffect(() => {
    Promise.all([getElements({ folder }), getFolderLayout({ folder })]).then(([elementsRes, layoutRes]) => {
      setFolderBoard({ ...folderBoard, elements: elementsRes.data.elements, layout: layoutRes.data, isPrivate: elementsRes.data.isPrivate });

    })
  }, [changes]); //when folder is added or deleted*/

  const handleRemove = ({ element }) => { removeElement({ element }).then(() => setChanges(!changes)) }


  const onLayoutChange = (newLayout) => { updateFolderLayout({ folder, layout: newLayout }).then(() => setFolderBoard({ ...folderBoard, layout: newLayout })); }

  return (<>
    <PageTitle {...{ open, setOpen, folder, isPrivate: folderBoard.isPrivate, changes, setChanges }} />
    <AddItemDashboard {...{ open, setOpen, changes, setChanges, folder }} />
    {alerts.showAlert && <DeleteAlert {...{ alerts, setAlerts, handleRemove }} />}

    <ReactGridLayout onLayoutChange={onLayoutChange} layout={folderBoard.layout} {...gridProps}>
      {folderBoard.elements.map((element, i) =>
        <div className={`grid-element ${element?.type && "element-" + element.type}`} ref={elementsRefs.ref(i)} key={element._id} data-grid={{ w: 1, h: 3, x: 1, y: 0 }} >
          <div>
            <ElementButtons {...{ element, alerts, setAlerts, open, setOpen, elementRef: elementsRefs.map.get(i) }} />
            <ElementContent {...{ element, elementRef: elementsRefs.map.get(i) }} />
          </div>
        </div>

      )}
    </ReactGridLayout >

  </>)
}

export const FolderPage = withProtected(Page);


const AddItemDashboard = ({ open, setOpen, changes, setChanges, folder }) =>
  (<div className="menu">
    {open.text && <TextEditor {...{ changes, setChanges, open, setOpen, folder }} />}
    {open.textEdit.state && <TextEditor {...{ changes, setChanges, open, setOpen, folder, edit: true }} />}
    {open.image && <UploadImage {...{ changes, setChanges, open, setOpen, folder }} />}
    {open.audio && <UploadAudio {...{ changes, setChanges, open, setOpen, folder }} />}

  </div>)

const PageTitle = ({ folder, open, setOpen, isPrivate, changes, setChanges }) => (
  <div className="page-title">
    <FolderIcon />
    <h1>{folder}</h1>
    <AddItemCollapsible {...{ open, setOpen }} />
    <ChangePrivacyButton {...{ folder, isPrivate, changes, setChanges }} />
  </div>
)

const ElementButtons = ({ element, alerts, setAlerts, open, setOpen, elementRef }) => (
  <div className="element-buttons" style={{ width: elementRef?.getBoundingClientRect().width - 2 || 500, overflowX: "hidden" }}>
    {element.type == "text" && <EditButton onClick={() => setOpen({ ...open, textEdit: { state: true, element } })} />}
    <DeleteButton {...{ setAlerts, alerts, element }} />
  </div>
)

const ElementContent = ({ element, elementRef }) => (<>
  {element.type == "text" && <TextElement text={element.text} />}
  {element.type == "image" && <ImageElement image={element.image} size={elementRef?.getBoundingClientRect() || 500} />}
  {element.type == "audio" && <AudioElement audio={element.audio} size={elementRef?.getBoundingClientRect() || 500} />}
</>
)

