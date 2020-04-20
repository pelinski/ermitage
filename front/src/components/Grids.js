
import React, { useState } from "react";
import { animated as Animated, useSpring } from "react-spring"
import { Link } from "react-router-dom"
import RGL, { WidthProvider } from "react-grid-layout";
import MultiRef from 'react-multi-ref';

import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"

import { LockIcon, UnlockIcon } from "../components/Icons";
import { TextElement, ImageElement, AudioElement } from "../components/Elements"
import { DeleteButton, EditButton } from "../components/Buttons";

import { updateFolderLayout } from "../api/elements.api"
import { useUser } from "../api/auth.api";
import { updateDashboardLayout } from "../api/dashboard.api";


const ReactGridLayout = WidthProvider(RGL);

export const DashboardGrid = ({ dashboard, setDashboard, setChanges, setAlerts }) => {
  const user = useUser();
  const isUserDashboardOwner = user.username == dashboard.dashboardUsername;
  const props = {
    grid: {
      cols: 8,
      rowHeight: 30,
    },
    spring: useSpring({ opacity: 1, from: { opacity: 0 }, duration: 600 })
  }
  const onLayoutChange = (newLayout) => {
    updateDashboardLayout({ layout: newLayout }).then(() => setDashboard({ ...dashboard, layout: newLayout }));
  }
  if (dashboard.layout != []) {
    return (
      <ReactGridLayout className="layout" layout={dashboard.layout} {...props.grid} onLayoutChange={(e) => isUserDashboardOwner && onLayoutChange(e)} isDraggable={isUserDashboardOwner} isResizable={isUserDashboardOwner}>

        {dashboard.folders.filter((e) => {
          const isFolderFromUser = e.user.username == user.username;
          const isFolderPrivate = e.isPrivate;
          if (isFolderPrivate && !isFolderFromUser) {
            return false
          } else {
            return true
          }
        }).map((e, i) => {
          const isFolderFromUser = e.user.username == user.username;
          return (
            <Animated.div key={e._id} style={props.spring} className="folder grid-element" data-grid={{ w: 1, h: 3, x: i - 1, y: 0 }}>
              <Folder setChanges={setChanges} deleteFolder={() => {
                setAlerts({ showAlert: true, remove: e });
              }}>
                {e.isPrivate ? <LockIcon /> : <UnlockIcon />}
                <Link style={{ display: "inline-block", width: "80%" }} to={e.path}>{e.folder}</Link>
                {isUserDashboardOwner && (!isFolderFromUser && <p>by @<em>{e.user.username}</em></p>)}
              </Folder>
            </Animated.div>
          )
        })}
      </ReactGridLayout>)
  }
  else {
    return <div>No folders</div>
  }

}


export const FolderGridOwner = ({ folderBoard, setFolderBoard, open, setOpen }) => {
  const [elementsRefs] = useState(() => new MultiRef());
  const gridProps = { cols: 8, rowHeight: 30, className: "layout", useCSSTransforms: true, margin: [10, 10], containerPadding: [10, 10] }
  const onLayoutChange = (newLayout) => { updateFolderLayout({ folder: folderBoard.folder.name, layout: newLayout }).then(() => setFolderBoard({ ...folderBoard, layout: newLayout })); }


  return (<ReactGridLayout onLayoutChange={onLayoutChange} layout={folderBoard.layout} {...gridProps}>
    {folderBoard.elements.map((element, i) =>
      <div className={`grid-element ${element?.type && "element-" + element.type}`} ref={elementsRefs.ref(i)} key={element._id} data-grid={{ w: 1, h: 3, x: 1, y: 0 }} >
        <div>
          <ElementButtons {...{ element, open, setOpen, elementRef: elementsRefs.map.get(i) }} />
          <ElementContent {...{ element, elementRef: elementsRefs.map.get(i) }} />
        </div>
      </div>

    )}
  </ReactGridLayout >)
}

export const FolderGridVisitor = ({ folderBoard }) => {
  const [elementsRefs] = useState(() => new MultiRef());

  const gridProps = { cols: 8, rowHeight: 30, className: "layout", useCSSTransforms: true, margin: [10, 10], containerPadding: [10, 10] }

  return (<ReactGridLayout layout={folderBoard.layout} {...gridProps} isDraggable={false} isResizable={false}>
    {folderBoard.elements.map((element, i) =>
      <div className={`grid-element ${element?.type && "element-" + element.type}`} ref={elementsRefs.ref(i)} key={element._id} data-grid={{ w: 1, h: 3, x: 1, y: 0 }} >
        <div>
          <ElementContent {...{ element, elementRef: elementsRefs.map.get(i) }} />
        </div>
      </div>

    )}
  </ReactGridLayout >)
}


const Folder = ({ children, deleteFolder }) => (<>
  <button onClick={() => deleteFolder()} className="folderDetail"> x </button>
  <div className="folderContent">{children}</div>
</>)


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
