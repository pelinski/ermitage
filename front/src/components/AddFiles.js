import React, { useState } from "react";
import { uploadImage, uploadAudio } from "../api/elements.api";
import _ from "lodash";



export const UploadImage = ({ open, setOpen, folder }) => {
  const [file, setFile] = useState();
  const handleSubmit = () => {
    const image = file.files[0];
    uploadImage({ image, folder }).then(() => setOpen({ ...open, changes: !open.changes })).catch((e) => {
      console.log("Error uploading file");
      console.log(e);
    });
  };

  return (
    <>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
        <input name="image" type="file" ref={(ref) => setFile(ref)} />
        <button type="submit">Upload Image</button>
      </form>
    </>
  )
};


export const UploadAudio = ({ open, setOpen, folder }) => {
  const [file, setFile] = useState();
  const handleSubmit = () => {
    const audio = file.files[0];
    uploadAudio({ audio, folder }).then(() => setOpen({ ...open, changes: !open.changes })).catch((e) => {
      console.log("Error uploading file");
      console.log(e);
    });
  };

  return (
    <>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
        <input name="audio" type="file" ref={(ref) => setFile(ref)} />
        <button type="submit">Upload Audio</button>
      </form>
    </>
  )
};

