import React from "react"
import { getProfileInfo, updateProfileInfo } from "../api/auth.api"

export const ProfileBanner = ({ user }) => (
  <div className="profileBanner">
    <div className="profilePic"></div>
    <div>
      <h1>{user.username}</h1>
      <div>
        <p>Hello this is my super cool bio</p>
      </div>
    </div>
  </div>)