import React from "react";
import parse from 'html-react-parser';
import { Image, Transformation } from 'cloudinary-react';



export const TextElement = ({ text }) => <>{parse(text)}</>
export const ImageElement = ({ image, width }) => {

  return (
    < Image publicId={`${image.public_id}.${image.format}`} cloudName='ddrvhqadf'>
      <Transformation width={width} dpr="auto" crop="fill" />
    </Image >)
}




// { width: 200, crop: "fit" }
//  <Transformation overlay="text:arial_60:pic" gravity="north" y="20" />
//<Transformation angle="20" />