import React, { useState, useEffect, useRef } from "react"
import { Image, Transformation } from 'cloudinary-react';
import parse from 'html-react-parser';
import { animated as Animated } from 'react-spring'

import { uploadProfilePicture, useUser } from "../api/auth.api"
import { EditIcon, ProfileIcon, DeleteIcon, UploadIcon, PicIcon } from "./Icons"
import { BioEditor } from "../components/TextEditor"

export const ProfileBanner = ({ dashboard, changes, setChanges, fadeIn }) => {
  const user = useUser();
  const [profile, setProfile] = useState({
    open: false,
    changes: false,
    profileInfo: dashboard.profileInfo,
    isUserDashboardOwner: user.username == dashboard.dashboardUsername,
    doesUserExist: dashboard.doesUserExist
  });

  useEffect(() => {
    setProfile({ ...profile, profileInfo: dashboard.profileInfo, doesUserExist: dashboard.doesUserExist })
  }, [dashboard.profileInfo])

  return (<>
    <Animated.div style={fadeIn} className={`profileBanner ${!profile.doesUserExist && "not-found"}`}>
      <div className="row">
        <div className="profilePic-wrapper">
          <ProfilePic {...{ profile, changes, setChanges }} />
        </div>
        <div className="profileInfo">
          <h1>@{profile.doesUserExist ? dashboard.dashboardUsername : "404"}</h1>
          <Bio {...{ profile, setProfile, changes, setChanges }} />
        </div>
        {profile.doesUserExist && <button className="edit-button" onClick={() => setProfile({ ...profile, open: !profile.open })}>{profile.isUserDashboardOwner && (profile.open ? <DeleteIcon /> : <EditIcon />)}</button>}
      </div>

    </Animated.div>
  </>)
}

const ProfilePic = ({ profile, changes, setChanges }) => {
  const ref = useRef(null);
  if (profile.profileInfo.profilePicId != "") {
    return (<div className="profilePic" ref={ref}>
      {profile.isUserDashboardOwner && profile.open && <ChangeProfilePictureBtn {...{ changes, setChanges }} />}
      < Image publicId={profile.profileInfo.profilePicId} cloudName='ddrvhqadf' draggable="false" >
        <Transformation height={Math.round(ref.current?.getBoundingClientRect().height) || 100} width={Math.round(ref.current?.getBoundingClientRect().width) || 100} dpr="auto" crop="fill" />
      </Image >
    </div>)
  } else {
    return <div className="profilePic" ref={ref}><ProfileIcon /></div>
  }
}

const Bio = ({ profile, setProfile, setChanges, changes }) => (<>

  {!profile.open && (profile.doesUserExist ? parse(profile.profileInfo.bio) : "Sorry, this user does not exist")}
  {profile.isUserDashboardOwner && profile.open && <BioEditor {...{ profile, setProfile, changes, setChanges }} />}
</>)


const ChangeProfilePictureBtn = ({ changes, setChanges }) => {
  const [file, setFile] = useState();
  const [feedback, setFeedback] = useState(false);


  const handleSubmit = () => {
    const profilePic = file.files[0];
    uploadProfilePicture({ profilePic }).then(() => {
      setChanges(!changes)
      setFeedback(!feedback)
    }).catch((e) => {
      console.log("change profile pic");
      console.log(e);
    });
  };


  return (

    <form className="buttons" onSubmit={(e) => { e.preventDefault(); setFeedback(false); handleSubmit() }}>
      {!feedback && < label htmlFor="profilepic"><PicIcon /> </label>}
      <input name="profilepic" id="profilepic" type="file" ref={(ref) => setFile(ref)} onChange={() => setFeedback(true)} />
      {feedback && <button type="submit" ><UploadIcon /> </button>}
      {feedback && <button type="button" onClick={() => setFeedback(false)}><DeleteIcon /></button>}
    </form>

  )
}


