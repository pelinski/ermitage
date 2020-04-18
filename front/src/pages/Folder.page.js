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
import { addFolderToDashboard, deleteFolder, getFolders } from "../api/dashboard.api"
import { useUser } from "../api/auth.api"
import { DeleteButton, EditButton, ChangePrivacyButton } from "../components/Buttons";
import { NotFound } from "./NotFound.page";

const ReactGridLayout = WidthProvider(RGL);


const Page = ({ folder, folderUsername }) => {

  const user = useUser();

  const [elementsRefs] = useState(() => new MultiRef());

  //changes and collapsibles
  const [open, setOpen] = useState({
    main: false,
    text: false,
    textEdit: { state: false, element: null },
    audio: false,
    images: false,
    alerts: {
      remove: {},
      showAlert: false
    },
    changes: true
  })

  //static once loaded
  const [folderBoard, setFolderBoard] = useState({
    elements: [],
    layout: [],
    isPrivate: null,
    folderId: "",
    folder: { name: folder, user: folderUsername }
  });



  const gridProps = { cols: 8, rowHeight: 30, className: "layout", useCSSTransforms: true, margin: [10, 10], containerPadding: [10, 10] }


  useEffect(() => {
    Promise.all([getElements({ folder, folderUsername }), getFolderLayout({ folder, folderUsername })]).then(([elementsRes, layoutRes]) => {
      setFolderBoard({ ...folderBoard, folderId: elementsRes.data.folderId, elements: elementsRes.data.elements, layout: layoutRes.data, isPrivate: elementsRes.data.isPrivate });
    })
  }, [open.changes]); //when folder is added or deleted*/



  const handleRemove = ({ element }) => { removeElement({ element }).then(() => setOpen({ ...open, changes: !open.changes })) }
  const onLayoutChange = (newLayout) => { updateFolderLayout({ folder, layout: newLayout }).then(() => setFolderBoard({ ...folderBoard, layout: newLayout })); }

  if (user.username == folderUsername) {
    return (<>
      <PageTitle {...{ open, setOpen, folder, isPrivate: folderBoard.isPrivate, folderBoard }} />
      <AddItemDashboard {...{ open, setOpen, folder }} />
      {open.alerts.showAlert && <DeleteAlert {...{ open, setOpen, handleRemove }} />}

      <ReactGridLayout onLayoutChange={onLayoutChange} layout={folderBoard.layout} {...gridProps}>
        {folderBoard.elements.map((element, i) =>
          <div className={`grid-element ${element?.type && "element-" + element.type}`} ref={elementsRefs.ref(i)} key={element._id} data-grid={{ w: 1, h: 3, x: 1, y: 0 }} >
            <div>
              <ElementButtons {...{ element, open, setOpen, elementRef: elementsRefs.map.get(i) }} />
              <ElementContent {...{ element, elementRef: elementsRefs.map.get(i) }} />
            </div>
          </div>

        )}
      </ReactGridLayout >
    </>)
  } else if (user.username != folderUsername && folderBoard.isPrivate == false) {
    return (<>
      <PageTitle {...{ open, setOpen, folder, isPrivate: folderBoard.isPrivate, visitor: true, folderUsername, user, folderBoard }} />
      <ReactGridLayout layout={folderBoard.layout} {...gridProps} isDraggable={false} isResizable={false}>
        {folderBoard.elements.map((element, i) =>
          <div className={`grid-element ${element?.type && "element-" + element.type}`} ref={elementsRefs.ref(i)} key={element._id} data-grid={{ w: 1, h: 3, x: 1, y: 0 }} >
            <div>
              <ElementContent {...{ element, elementRef: elementsRefs.map.get(i) }} />
            </div>
          </div>

        )}
      </ReactGridLayout >

    </>)
  } else {
    return (<NotFound />)
  }
}

export const FolderPage = withProtected(Page);


const AddItemDashboard = ({ open, setOpen, folder }) =>
  (<div className="menu">
    {open.text && <TextEditor {...{ open, setOpen, folder }} />}
    {open.textEdit.state && <TextEditor {...{ open, setOpen, folder, edit: true }} />}
    {open.image && <UploadImage {...{ open, setOpen, folder }} />}
    {open.audio && <UploadAudio {...{ open, setOpen, folder }} />}

  </div>)

const PageTitle = ({ open, setOpen, visitor = false, folderBoard }) => {
  const [userFolders, setUserFolders] = useState();
  useEffect(() => { getFolders().then(res => setUserFolders(res.data.map(e => e._id))) }
    , [open.changes]) // get updated folders from user: getting them from context does not work because context only loads when page refreshes
  return (
    < div className="page-title" >
      <FolderIcon />
      <h1>{folderBoard.folder.name}</h1>
      {visitor && <p>by {folderBoard.folder.user}</p>}
      {visitor && !userFolders?.includes(folderBoard.folderId) && <button onClick={() => addFolderToDashboard({ folderId: folderBoard.folderId }).then(() => setOpen({ ...open, changes: !open.changes }))}>Add to your folders</button>}
      {visitor && userFolders?.includes(folderBoard.folderId) && <button onClick={() => deleteFolder({ folderId: folderBoard.folderId }).then(() => setOpen({ ...open, changes: !open.changes }))}>Remove folder from your dashboard</button>}
      {!visitor && <AddItemCollapsible {...{ open, setOpen }} />}
      {!visitor && <ChangePrivacyButton {...{ folderBoard, open, setOpen }} />}
    </div >
  )
}

const ElementButtons = ({ element, open, setOpen, elementRef }) => (
  <div className="element-buttons" style={{ width: elementRef?.getBoundingClientRect().width - 2 || 500, overflowX: "hidden" }}>
    {element.type == "text" && <EditButton onClick={() => setOpen({ ...open, textEdit: { state: true, element } })} />}
    <DeleteButton {...{ setOpen, open, element }} />
  </div>
)

const ElementContent = ({ element, elementRef }) => (<>
  {element.type == "text" && <TextElement text={element.text} />}
  {element.type == "image" && <ImageElement image={element.image} size={elementRef?.getBoundingClientRect() || 500} />}
  {element.type == "audio" && <AudioElement audio={element.audio} size={elementRef?.getBoundingClientRect() || 500} />}
</>
)

