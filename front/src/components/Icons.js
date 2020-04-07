import React from "react"

import audioIcon from "../public/audio.svg"
import folderIcon from "../public/folder.svg"
import textIcon from "../public/text.svg"
import elementIcon from "../public/element_add.svg"
import deleteIcon from "../public/delete.svg"
import cameraIcon from "../public/camera.svg"
import elementCloseIcon from "../public/element_close.svg"

export const FolderIcon = () => <img src={folderIcon} alt="Folder icon" />;
export const AudioIcon = () => <img src={audioIcon} alt="Auio icon" />;
export const TextIcon = () => <img src={textIcon} alt="Text icon" />;
export const ElementIcon = () => <img src={elementIcon} alt="Element icon" />;
export const ElementCloseIcon = () => <img src={elementCloseIcon} alt="Element close icon" />;
export const DeleteIcon = () => <img src={deleteIcon} alt="Delete icon" />;
export const CameraIcon = () => <img src={cameraIcon} alt="Camera icon" />;