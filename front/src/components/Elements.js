import React from "react";
import parse from 'html-react-parser';
import ReactPlayer from 'react-player'
import { Image, Transformation } from 'cloudinary-react';



export const TextElement = ({ text }) => <div className="text-content">{parse(text)}</div>
export const ImageElement = ({ image, size }) => (
  < Image publicId={`${image.public_id}.${image.format}`} cloudName='ddrvhqadf' draggable="false" >
    <Transformation height={Math.round(size?.height) || 500} width={Math.round(size?.width) || 500} dpr="auto" crop="fill" />
  </Image >)

export const AudioElement = ({ audio, size }) => (
  < div className="audio-content" style={{ height: size?.height - 2 || 500 }}>
    <p >{audio.originalname}</p>
    <ReactPlayer url={audio.url} className="audio-player" controls={true} height={40} width={size?.width - 2 || 500} />
  </div>)

/*
export const VideoElement = ({ video, size }) =>
  <ReactPlayer url={video.url} className="video-player" controls={true} width={size?.width - 4 || 500} height={size?.height - 4 || 500} />
*/

//<Transformation overlay="text:arial_60:pic" gravity="north" y="0" />