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
import archiveIcon from "../public/archive.svg"
import searchIcon from "../public/search.svg"
import searchCloseIcon from "../public/search_close.svg"
import logoutIcon from "../public/logout.svg"
import uploadIcon from "../public/upload.svg"
import picIcon from "../public/pic.svg"
import okIcon from "../public/ok.svg"
import folderAddIcon from "../public/folder_add.svg"
import folderRemoveIcon from "../public/folder_remove.svg"



const Icon = ({ src, style }) => (< img style={style} draggable="false" src={src} alt={src} />)


export const AudioIcon = ({ open, setOpen }) => {
  const props = useSpring({ opacity: open.main ? 1 : 1, from: { opacity: 0 }, duration: 2000 })
  return (
    <Animated.button style={props} onClick={() => setOpen({ ...open, audio: !open.audio })}>
      <Icon src={audioIcon} />
    </Animated.button>)
};
export const TextIcon = ({ open, setOpen }) => {
  const props = useSpring({ opacity: open.main ? 1 : 1, from: { opacity: 0 }, duration: 1500 })
  return (
    <Animated.button style={props} onClick={() => setOpen({ ...open, text: !open.text })}>
      <Icon src={textIcon} />
    </Animated.button>)
};

export const CameraIcon = ({ open, setOpen }) => {
  const props = useSpring({ opacity: open.main ? 1 : 1, from: { opacity: 0 }, duration: 1000 })
  return (
    <Animated.button style={props} onClick={() => setOpen({ ...open, image: !open.image })}>
      <Icon src={cameraIcon} />
    </Animated.button>)
};

export const ArchiveIcon = () => <Icon style={{ paddingTop: 3 }} src={archiveIcon} />
export const FolderIcon = () => <Icon src={folderIcon} />;
export const ElementIcon = () => <Icon src={elementIcon} />;
export const ElementCloseIcon = () => <Icon src={elementCloseIcon} />;
export const DeleteIcon = () => <Icon src={deleteIcon} />;
export const EditIcon = () => <Icon src={editIcon} />
export const LockIcon = () => <Icon src={lockIcon} />
export const UnlockIcon = () => <Icon src={unlockIcon} />;
export const ProfileIcon = () => <Icon src={profileIcon} />;
export const SearchIcon = () => <Icon style={{ width: "34px", paddingTop: 3 }} src={searchIcon} />;
export const SearchCloseIcon = () => <Icon style={{ width: "34px", paddingTop: 3 }} src={searchCloseIcon} />;
export const LogoutIcon = () => <Icon style={{ width: "34px" }} src={logoutIcon} />;
export const UploadIcon = () => <Icon src={uploadIcon} />
export const PicIcon = () => <Icon src={picIcon} />
export const OkIcon = () => <Icon src={okIcon} />
export const FolderAddIcon = () => <Icon src={folderAddIcon} />
export const FolderRemoveIcon = () => <Icon src={folderRemoveIcon} />