import React, { useState, useEffect, useRef } from "react"
import { Image, Transformation } from 'cloudinary-react';
import parse from 'html-react-parser';

import { getProfileInfo, uploadProfilePicture } from "../api/auth.api"
import { EditIcon, ProfileIcon, DeleteIcon } from "./Icons"
import { BioEditor } from "../components/TextEditor"

export const ProfileBanner = ({ user }) => {

  const [profile, setProfile] = useState({
    open: false,
    changes: false,
    profileInfo: {
      profilePicId: "",
      bio: ""
    }
  });

  useEffect(() => {
    getProfileInfo({ username: user.username }).then((res) => {
      console.log(res.data)
      setProfile({ ...profile, profileInfo: { profilePicId: res.data.profilePicId, bio: res.data.bio } })
    }
    )
  }, [profile.changes])

  return (<>
    <div className="profileBanner">
      <div className="row">
        <ProfilePic {...{ profile }} />
        <div className="profileInfo">
          <h1>@{user.username}</h1>
          {parse(profile.profileInfo.bio)}
        </div>
        <button onClick={() => setProfile({ ...profile, open: !profile.open })}>{profile.open ? <DeleteIcon /> : <EditIcon />}</button>
      </div>
      {profile.open && <ChangeProfilePictureBtn {...{ profile, setProfile }} />}
      {profile.open && <BioEditor {...{ profile, setProfile }} />}
    </div>
  </>)
}

const ProfilePic = ({ profile }) => {
  const ref = useRef(null);
  if (profile.profileInfo.profilePicId != "") {
    console.log(profile.profileInfo.profilePicId)
    return (<div className="profilePic" ref={ref}>
      < Image publicId={profile.profileInfo.profilePicId} cloudName='ddrvhqadf' draggable="false" >
        <Transformation height={ref.current?.getBoundingClientRect().height || 100} width={ref.current?.getBoundingClientRect().width || 100} dpr="auto" crop="fill" />
      </Image >
    </div>)
  } else {
    return <div className="profilePic" ref={ref}><ProfileIcon /></div>
  }
}


const ChangeProfilePictureBtn = ({ profile, setProfile }) => {
  const [file, setFile] = useState();
  const handleSubmit = () => {
    const profilePic = file.files[0];
    uploadProfilePicture({ profilePic }).then(() => setProfile({ ...profile, changes: !profile.changes })).catch((e) => {
      console.log("change profile pic");
      console.log(e);
    });
  };

  return (
    <>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
        <input name="profilepic" type="file" ref={(ref) => setFile(ref)} />
        <button type="submit">Update</button>
      </form>
    </>
  )
}


