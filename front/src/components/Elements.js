import React from "react";
import parse from 'html-react-parser';
import { Image, Transformation } from 'cloudinary-react';



export const TextElement = ({ text }) => <>{parse(text)}</>
export const ImageElement = ({ image, width }) => (
  < Image publicId={`${image.public_id}.${image.format}`} cloudName='ddrvhqadf' draggable="false" >
    <Transformation width={width} dpr="auto" crop="fill" />
  </Image >)



//<Transformation overlay="text:arial_60:pic" gravity="north" y="0" />