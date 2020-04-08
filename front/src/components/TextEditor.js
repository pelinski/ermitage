import React, { useState, useEffect, useRef } from "react"
import { stateToHTML } from 'draft-js-export-html';
import { Editor, EditorState, RichUtils } from 'draft-js';

import "/node_modules/draft-js/dist/Draft.css"

import { uploadText } from "../api/elements.api"


export const TextEditor = ({ changes, setChanges, open, setOpen, folder }) => {
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
  useEffect(() => { editor.current.focus() }, [editorState]);



  const handleAdd = () => {
    uploadText({ text: stateToHTML(editorState.getCurrentContent()), folder }).then(() => setChanges(!changes));
  };



  return (
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
        <button onClick={() => setOpen({ ...open, text: !open.text })} >X</button>


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
  )
}