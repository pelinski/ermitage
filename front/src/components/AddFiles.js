import React, { useState } from "react";
import { uploadImage } from "../api/elements.api";
import _ from "lodash";
import cloudinary from "cloudinary-core";

//const cl = cloudinary.Cloudinary.new({ cloud_name: "driuopbnh" });

export const UploadImage = ({ changes, setChanges, open, setOpen, folder }) => {
  const [file, setFile] = useState();


  const handleSubmit = () => {
    const image = file.files[0];
    uploadImage({ image, folder }).then(() => setChanges(!changes)).catch((e) => {
      console.log("Error uploading file");
      console.log(e);
    });
  };

  /*
   if (user.profilePic) {
     // CLOUDINARY FILE
     //imgPath = _.get(user, "profilePic.url");
     const imgID = _.get(user, "profilePic.public_id");
     console.log("Generate image", imgID);
     imgPath = cl.url(imgID, { width: 200, crop: "fit" });
     console.log(imgPath);
 
   }*/

  return (
    <>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
        <input name="image" type="file" ref={(ref) => setFile(ref)} />
        <button type="submit">Upload Image</button>
      </form>
    </>
  )
};
