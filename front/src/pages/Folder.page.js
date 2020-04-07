import React, { useState, useEffect, useRef } from "react";
import RGL, { WidthProvider } from "react-grid-layout";
import styled from "styled-components"
import { Editor, EditorState, RichUtils } from 'draft-js';
import parse from 'html-react-parser';
import { stateToHTML } from 'draft-js-export-html';

import "/node_modules/react-grid-layout/css/styles.css"
import "/node_modules/react-resizable/css/styles.css"
import "/node_modules/draft-js/dist/Draft.css"
import { Field } from "../components/Form";
import { AddItemCollapsible } from "../components/Collapsible"
import { AudioIcon, FolderIcon, TextIcon, ElementIcon, DeleteIcon, CameraIcon } from "../components/Icons"


import { withProtected } from "../lib/protectRoute.hoc"
import { uploadText, getText, removeText, updateFolderLayout, getFolderLayout } from "../api/elements.api"
import { handleInputChange } from "../lib/formHelpers";

const ReactGridLayout = WidthProvider(RGL);
const TitleWrapper = styled.div`
display:flex;
align-items:center;
img {

  padding-right:10px;
}
`
const TextComponent = ({ text }) => <>{parse(text)}</>

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

  // Editor
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  }



  const editor = useRef(null);
  useEffect(() => {
    console.log(stateToHTML(editorState.getCurrentContent()))     //HTML FORMAT
    editor.current.focus()
  }, [editorState]);

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
    uploadText({ text: stateToHTML(editorState.getCurrentContent()), folder }).then(() => setChanges(!changes));
  };

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

    <div className="editorContainer" onClick={() => editor.current.focus()}>
      <div className="editorButtons">
        <button onClick={() => setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'))} >U</button>
        <button onClick={() => setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'))}  ><b>B</b></button>
        <button onClick={() => setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'))} ><em>I</em></button>
        <button onClick={() => setEditorState(RichUtils.toggleBlockType(editorState, 'header-one'))} >h1</button>
        <button onClick={() => setEditorState(RichUtils.toggleBlockType(editorState, 'header-two'))} >h2</button>
        <button onClick={() => setEditorState(RichUtils.toggleBlockType(editorState, 'header-three'))} >h3</button>
        <button onClick={() => setEditorState(RichUtils.toggleBlockType(editorState, 'header-four'))} >h4</button>
        <button onClick={handleAdd} >Add</button>

      </div>
      <div className="editor">
        <Editor
          spellCheck={true}
          ref={editor}
          placeholder="Write here"
          handleKeyCommand={handleKeyCommand}
          editorState={editorState}
          onChange={editorState => setEditorState(editorState)}
        />
      </div>
    </div>

    <div className="add-item">
      <AddItemCollapsible {...{ open, setOpen }}>

        {/*<Field field="text" {...{ example: "text input", data }} handleInputChange={(e) => handleInputChange(e, data, setData)} />
        <button onClick={handleAdd}>+</button>*/}
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

            {element.type == "text" && <TextComponent text={element.text} />}
          </div>)
      })}
    </ReactGridLayout>
    {alerts.showAlert && <DeleteAlert />}

  </>)
}

export const FolderPage = withProtected(Page);
