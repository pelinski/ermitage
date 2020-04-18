import React from "react"
import { useSpring, animated as Animated } from 'react-spring'

import audioIcon from "../public/audio.svg"
import folderIcon from "../public/folder.svg"
import textIcon from "../public/text.svg"
import elementIcon from "../public/element_add.svg"
import deleteIcon from "../public/delete.svg"
import editIcon from "../public/edit.svg"
import lockIcon from "../public/lock.svg"
import unlockIcon from "../public/unlock.svg"
import cameraIcon from "../public/camera.svg"
import elementCloseIcon from "../public/element_close.svg"
import profileIcon from "../public/profile.svg"

import searchIcon from "../public/search.svg"
import searchCloseIcon from "../public/search_close.svg"



export const FolderIcon = () => <img draggable="false" src={folderIcon} alt="Folder icon" />;

export const AudioIcon = ({ open, setOpen }) => {
  const props = useSpring({ opacity: open.main ? 1 : 1, from: { opacity: 0 }, duration: 2000 })
  return (
    <Animated.button style={props} onClick={() => setOpen({ ...open, audio: !open.audio })}>
      <img draggable="false" src={audioIcon} alt="Audio icon" />
    </Animated.button>)
};
export const TextIcon = ({ open, setOpen }) => {
  const props = useSpring({ opacity: open.main ? 1 : 1, from: { opacity: 0 }, duration: 1500 })
  return (
    <Animated.button style={props} onClick={() => setOpen({ ...open, text: !open.text })}>
      <img draggable="false" src={textIcon} alt="Text icon" />
    </Animated.button>)
};

export const CameraIcon = ({ open, setOpen }) => {
  const props = useSpring({ opacity: open.main ? 1 : 1, from: { opacity: 0 }, duration: 1000 })
  return (
    <Animated.button style={props} onClick={() => setOpen({ ...open, image: !open.image })}>
      <img draggable="false" src={cameraIcon} alt="Camera icon" />
    </Animated.button>)
};

export const ElementIcon = () => <img draggable="false" src={elementIcon} alt="Element icon" />;

export const ElementCloseIcon = () => <img draggable="false" src={elementCloseIcon} alt="Element close icon" />;

export const DeleteIcon = () => <img draggable="false" src={deleteIcon} alt="Delete icon" />;

export const EditIcon = () => <img draggable="false" src={editIcon} alt="Edit icon" />;

export const LockIcon = () => <img draggable="false" src={lockIcon} alt="Lock icon" />;

export const UnlockIcon = () => <img draggable="false" src={unlockIcon} alt="Unlock icon" />;

export const ProfileIcon = () => <img draggable="false" src={profileIcon} alt="Profile icon" />;

export const SearchIcon = () => <img draggable="false" src={searchIcon} alt="Search icon" />;

export const SearchCloseIcon = () => <img draggable="false" src={searchCloseIcon} alt="Search close icon" />;