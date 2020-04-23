import React, { useState } from "react"

import { ElementIcon, ElementCloseIcon, AudioIcon, TextIcon, UploadIcon, DeleteIcon, PicIcon, CameraIcon, FolderAddIcon, FolderRemoveIcon } from "./Icons";
import { uploadImage, uploadAudio } from "../api/elements.api";

export const AddItemCollapsible = ({ open, setOpen, folder }) => (
  <div className="add-item">
    <div className="Collapsible">
      <button className="trigger" onClick={() => setOpen({ ...open, main: !open.main })}>
        {open.main || <ElementIcon />}
        {open.main && <ElementCloseIcon />}
      </button>
      {open.main && <UploadAudio {...{ open, setOpen, folder }} />}
      {open.main && <TextIcon {...{ open, setOpen }} />}
      {open.main && <UploadImage {...{ open, setOpen, folder }} />}
    </div>
  </div>
)



export const UploadImage = ({ open, setOpen, folder }) => {

  const [file, setFile] = useState();
  const [feedback, setFeedback] = useState(false);

  const handleSubmit = () => {
    const image = file.files[0];
    uploadImage({ image, folder }).then(() => { setOpen({ ...open, changes: !open.changes }); setFeedback(!feedback) }).catch((e) => {
      console.log("Error uploading file");
      console.log(e);
    });
  };

  return (

    <form className="buttons" onSubmit={(e) => { e.preventDefault(); setFeedback(false); handleSubmit() }}>
      {!feedback && < label htmlFor="image"><CameraIcon {...{ open }} /> </label>}
      <input name="image" id="image" type="file" ref={(ref) => setFile(ref)} onChange={() => setFeedback(true)} />
      {feedback && <button type="submit" ><UploadIcon /> </button>}
      {feedback && <button type="button" onClick={() => setFeedback(false)}><DeleteIcon /></button>}
    </form>

  )
};


export const UploadAudio = ({ open, setOpen, folder }) => {

  const [file, setFile] = useState();
  const [feedback, setFeedback] = useState(false);
  const handleSubmit = () => {
    const audio = file.files[0];
    uploadAudio({ audio, folder }).then(() => setOpen({ ...open, changes: !open.changes })).catch((e) => {
      console.log("Error uploading file");
      console.log(e);
    });
  };

  return (
    <>
      <form className="buttons" onSubmit={(e) => { e.preventDefault(); setFeedback(false); handleSubmit() }}>
        {!feedback && < label htmlFor="audio"><AudioIcon {...{ open }} /> </label>}
        <input name="audio" id="audio" type="file" ref={(ref) => setFile(ref)} onChange={() => setFeedback(true)} />
        {feedback && <button type="submit" ><UploadIcon /> </button>}
        {feedback && <button type="button" onClick={() => setFeedback(false)}><DeleteIcon /></button>}
      </form>
    </>
  )
};

