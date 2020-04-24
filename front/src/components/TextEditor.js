import React, { useState, useEffect, useRef } from "react"
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html'
import { Editor, EditorState, RichUtils } from 'draft-js'

import "/node_modules/draft-js/dist/Draft.css"

import { uploadText, editText } from "../api/elements.api"
import { updateProfileBio } from "../api/auth.api"
import { OkIcon, DeleteIcon } from "./Icons";

export const TextEditor = ({ open, setOpen, folder, edit = false }) => {

  const initialState = open.textEdit.element ? EditorState.createWithContent(stateFromHTML(open.textEdit?.element.text)) : EditorState.createEmpty();
  const [editorState, setEditorState] = useState(initialState)

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
    uploadText({ text: stateToHTML(editorState.getCurrentContent()), folder }).then(() => setOpen({ ...open, changes: !open.changes }))
  };

  const handleEdit = () => {
    editText({ text: stateToHTML(editorState.getCurrentContent()), id: open.textEdit.element._id }).then(() => setOpen({ ...open, changes: !open.changes }))
  };


  return (
    <div className="editorContainer" onClick={() => editor.current.focus()}>
      <div className="editorButtons">
        <div>
          <button onClick={() => setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'))} ><u>U</u></button>
          <button onClick={() => setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'))}  ><b>B</b></button>
          <button onClick={() => setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'))} ><em>I</em></button>
          <button onClick={() => setEditorState(RichUtils.toggleBlockType(editorState, 'header-one'))} >h1</button>
          <button onClick={() => setEditorState(RichUtils.toggleBlockType(editorState, 'header-two'))} >h2</button>
          <button onClick={() => setEditorState(RichUtils.toggleBlockType(editorState, 'header-three'))} >h3</button>
          <button onClick={() => setEditorState(RichUtils.toggleBlockType(editorState, 'header-four'))} >h4</button>
        </div>
        <div>
          {!edit && <button onClick={handleAdd} ><OkIcon /></button>}
          {edit && <button onClick={handleEdit} ><OkIcon /></button>}
          {!edit && <button onClick={() => setOpen({ ...open, text: !open.text })} ><DeleteIcon /></button>}
          {edit && <button onClick={() => setOpen({ ...open, textEdit: { state: false, element: null } })} ><DeleteIcon /></button>}
        </div>
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


export const BioEditor = ({ profile, setProfile, changes, setChanges }) => {
  const initialState = profile.profileInfo.bio != "" ? EditorState.createWithContent(stateFromHTML(profile.profileInfo.bio)) : EditorState.createEmpty();
  const [editorState, setEditorState] = useState(initialState)
  const [alert, setAlert] = useState(null);

  const characterLimit = 240;
  const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return 'handled';
    }
    return 'not-handled';
  }
  const handleBeforeInput = (text) => {
    if (editorState.getCurrentContent().getPlainText().length + text.length > characterLimit) {
      setEditorState(editorState);
      setAlert(true)
      return "handled"
    } else {
      setAlert(false);
      return "not-handled"
    }
  }
  const editor = useRef(null);

  useEffect(() => { editor.current.focus() }, [editorState]);



  const handleAdd = () => {
    updateProfileBio({ bio: stateToHTML(editorState.getCurrentContent()) }).then(() => { setChanges(!changes); setProfile({ ...profile, changes: !profile.changes, open: false }); }).catch((e) => {
      console.log("Error uploading bio");
      console.log(e);
    });

  };

  return (
    <div className="editorContainer" onClick={() => editor.current.focus()}>

      <div className="editor">
        <Editor
          spellCheck={true}
          ref={editor}
          placeholder="Add a bio"
          handleBeforeInput={handleBeforeInput}
          handleKeyCommand={handleKeyCommand}
          handlePastedText={handleBeforeInput}
          editorState={editorState}
          onChange={editorState => setEditorState(editorState)}
        />
        <div className="panel">
          {editorState.getCurrentContent().getPlainText().length + "/" + characterLimit}
          {alert && <p>You've reached the character limit</p>}
          <div className="editorButtons">
            <button onClick={() => setEditorState(RichUtils.toggleInlineStyle(editorState, 'UNDERLINE'))} >U</button>
            <button onClick={() => setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'))}  ><b>B</b></button>
            <button onClick={() => setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'))} ><em>I</em></button>

          </div>       <button className="add-icon" onClick={handleAdd} ><OkIcon /></button>
        </div>


      </div>

    </div>
  )
}