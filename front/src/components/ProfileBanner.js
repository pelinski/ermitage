import React, { useState, useEffect, useRef } from "react"
import { Image, Transformation } from 'cloudinary-react';
import parse from 'html-react-parser';

import { uploadProfilePicture, useUser } from "../api/auth.api"
import { EditIcon, ProfileIcon, DeleteIcon } from "./Icons"
import { BioEditor } from "../components/TextEditor"

export const ProfileBanner = ({ dashboard, changes, setChanges }) => {
  const user = useUser();
  const [profile, setProfile] = useState({
    open: false,
    changes: false,
    profileInfo: dashboard.profileInfo,
    isUserDashboardOwner: user.username == dashboard.dashboardUsername,

  });

  useEffect(() => setProfile({ ...profile, profileInfo: dashboard.profileInfo }), [dashboard.profileInfo])

  return (<>
    <div className="profileBanner">
      <div className="row">
        <ProfilePic {...{ profile }} />
        <div className="profileInfo">
          <h1>@{dashboard.dashboardUsername}</h1>
          <Bio {...{ profile, setProfile }} />
        </div>
        <button onClick={() => setProfile({ ...profile, open: !profile.open })}>{profile.isUserDashboardOwner && (profile.open ? <DeleteIcon /> : <EditIcon />)}</button>
      </div>
      <div className="profileEdit">
        {profile.isUserDashboardOwner && profile.open && <ChangeProfilePictureBtn {...{ changes, setChanges }} />}
      </div>
    </div>
  </>)
}

const ProfilePic = ({ profile }) => {
  const ref = useRef(null);
  if (profile.profileInfo.profilePicId != "") {
    return (<div className="profilePic" ref={ref}>
      < Image publicId={profile.profileInfo.profilePicId} cloudName='ddrvhqadf' draggable="false" >
        <Transformation height={ref.current?.getBoundingClientRect().height || 100} width={ref.current?.getBoundingClientRect().width || 100} dpr="auto" crop="fill" />
      </Image >
    </div>)
  } else {
    return <div className="profilePic" ref={ref}><ProfileIcon /></div>
  }
}

const Bio = ({ profile, setProfile }) => (<>

  {!profile.open && parse(profile.profileInfo.bio)}
  {profile.isUserDashboardOwner && profile.open && <BioEditor {...{ profile, setProfile }} />}
</>)


const ChangeProfilePictureBtn = ({ changes, setChanges }) => {
  const [file, setFile] = useState();
  const [feedback, setFeedback] = useState(false);


  const handleSubmit = () => {
    const profilePic = file.files[0];
    uploadProfilePicture({ profilePic }).then(() => {
      // setProfile({ ...profile, changes: !profile.changes });
      setChanges(!changes)
      setFeedback(!feedback)
    }).catch((e) => {
      console.log("change profile pic");
      console.log(e);
    });
  };


  return (
    <>
      <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
        <label htmlFor="profilepic">Choose a file</label>
        <input name="profilepic" id="profilepic" type="file" ref={(ref) => setFile(ref)} onChange={() => setFeedback(!feedback)} />
        <button type="submit">Update</button>
        {feedback && "vv"}
      </form>
    </>
  )
}


