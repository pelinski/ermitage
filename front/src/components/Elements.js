import React from "react";
import parse from 'html-react-parser';
import { Image, Transformation } from 'cloudinary-react';



export const TextElement = ({ text }) => <div className="text-content">{parse(text)}</div>
export const ImageElement = ({ image, height, width }) => (
  < Image publicId={`${image.public_id}.${image.format}`} cloudName='ddrvhqadf' draggable="false" >
    <Transformation height={height} width={width} dpr="auto" crop="fill" />
  </Image >)



//<Transformation overlay="text:arial_60:pic" gravity="north" y="0" />