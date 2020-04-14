import React, { useState } from "react";
import { uploadImage, uploadFile } from "../api/elements.api";
import _ from "lodash";


const handleSubmit = ({ file, folder, type, setChanges, changes }) => {
  uploadFile({ file: file.files[0], folder, type }).then(() => setChanges(!changes)).catch((e) => {
    console.log("Error uploading file");
    console.log(e);
  });
};

export const UploadImage = ({ changes, setChanges, open, setOpen, folder }) => {
  const [file, setFile] = useState();
  const handleSubmit = () => {
    const image = file.files[0];
    uploadImage({ image, folder }).then(() => setChanges(!changes)).catch((e) => {
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


export const UploadAudio = ({ changes, setChanges, open, setOpen, folder }) => {
  const [file, setFile] = useState();
  const handleSubmit = () => {
    uploadFile({ file: file.files[0], folder, type: "audio" }).then(() => setChanges(!changes)).catch((e) => {
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

