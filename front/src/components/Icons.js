import React from "react"
import { useSpring, animated as Animated } from 'react-spring'

import audioIcon from "../public/audio.svg"
import folderIcon from "../public/folder.svg"
import textIcon from "../public/text.svg"
import elementIcon from "../public/element_add.svg"
import deleteIcon from "../public/delete.svg"
import cameraIcon from "../public/camera.svg"
import elementCloseIcon from "../public/element_close.svg"

export const FolderIcon = () => <img src={folderIcon} alt="Folder icon" />;

export const AudioIcon = ({ open, setOpen }) => {
  const props = useSpring({ opacity: open.main ? 1 : 1, from: { opacity: 0 }, duration: 2000 })
  return (
    <Animated.button style={props} onClick={() => setOpen({ ...open, audio: !open.audio })}>
      <img src={audioIcon} alt="Audio icon" />
    </Animated.button>)
};
export const TextIcon = ({ open, setOpen }) => {
  const props = useSpring({ opacity: open.main ? 1 : 1, from: { opacity: 0 }, duration: 1500 })
  return (
    <Animated.button style={props} onClick={() => setOpen({ ...open, text: !open.text })}>
      <img src={textIcon} alt="Text icon" />
    </Animated.button>)
};
export const ElementIcon = () => <img src={elementIcon} alt="Element icon" />;
export const ElementCloseIcon = () => <img src={elementCloseIcon} alt="Element close icon" />;
export const DeleteIcon = () => <img src={deleteIcon} alt="Delete icon" />;

export const CameraIcon = ({ open, setOpen }) => {
  const props = useSpring({ opacity: open.main ? 1 : 1, from: { opacity: 0 }, duration: 1000 })
  return (
    <Animated.button style={props} onClick={() => setOpen({ ...open, image: !open.image })}>
      <img src={cameraIcon} alt="Camera icon" />
    </Animated.button>)
};
