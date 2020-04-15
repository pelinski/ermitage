import React from "react";
import parse from 'html-react-parser';
import ReactPlayer from 'react-player'
import { Image, Transformation } from 'cloudinary-react';



export const TextElement = ({ text }) => <div className="text-content">{parse(text)}</div>
export const ImageElement = ({ image, size }) => (
  < Image publicId={`${image.public_id}.${image.format}`} cloudName='ddrvhqadf' draggable="false" >
    <Transformation height={size?.height || 500} width={size?.width || 500} dpr="auto" crop="fill" />
  </Image >)

export const AudioElement = ({ audio, size }) => {
  return (< div className="audio-content" style={{ height: size?.height - 4 || 500 }}>
    <p >{audio.originalname}</p>
    <ReactPlayer url={audio.url} style={{ overflow: "hidden", display: "flex", justifyContent: "center", alignItems: "center", bottom: 0 }} controls={true} height={40} width={size?.width - 4 || 500} />
  </div>)
}
//<Transformation overlay="text:arial_60:pic" gravity="north" y="0" />