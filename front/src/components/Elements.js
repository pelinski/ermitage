import React from "react";
import parse from 'html-react-parser';

export const TextElement = ({ text }) => <>{parse(text)}</>
export const ImageElement = ({ image }) => <img src={image.url} />

