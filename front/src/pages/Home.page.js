import React, { useState } from "react"
import { useSpring, animated as Animated } from 'react-spring'

import { calc, trans } from "../lib/parallax"
import { useUser } from "../api/auth.api"

import { Button } from "../components/Buttons"

import logo from "../public/home-logo.svg"
import plane from "../public/hermitage-home.svg"
import { Signup, Login } from "../components/Auth"


export const HomePage = () => {
  const [propsParallax, set] = useSpring(() => ({ xy: [0, 0], config: { mass: 30, tension: 550, friction: 130 } }));
  const propsFadeIn = useSpring({ opacity: 1, from: { opacity: 0 }, duration: 800 });
  const user = useUser();
  return (
    <Animated.div id="home-page" style={propsFadeIn} onMouseMove={({ clientX: x, clientY: y }) => set({ xy: calc(x, y) })}>
      <Animated.div className="logo" style={{ transform: propsParallax.xy.interpolate(trans(80, 30)) }}>
        <img src={logo} />
      </Animated.div>
      <div className="sub-title-home">

        <Animated.div className="auth-col" style={{ transform: propsParallax.xy.interpolate(trans(500, 100)) }}>
          {!user && <AuthButtons {...{ propsFadeIn, propsParallax }} />}
          {user && <LoggedInButtons {...{ username: user.username }} />}
        </Animated.div>
        <Animated.img style={{ transform: propsParallax.xy.interpolate(trans(-300, 300)) }} className="map-col" src={plane} />

      </div >
    </Animated.div >
  )
};

const AuthButtons = ({ propsFadeIn, propsParallax }) => {
  const [open, setOpen] = useState({ login: false, signup: false });
  const [props, setProps] = useSpring(() => ({ opacity: 0, duration: 800 }));

  return (<>
    {(open.signup || open.login) && <Animated.h2 style={{ ...props, transform: propsParallax.xy.interpolate(trans(-300, 100)) }}>The place to collect what inspires you.</Animated.h2>}
    {!(open.signup || open.login) && <Animated.h2 style={{ ...propsFadeIn, transform: propsParallax.xy.interpolate(trans(-300, 100)) }}>The place to collect what inspires you.</Animated.h2>}

    <div className="Collapsible auth-collapsible">

      {!open.login &&
        <button className="trigger" onClick={() => { setOpen({ ...open, signup: !open.signup }); setProps({ opacity: !open.signup ? 1 : 0, duration: 800 }) }}>
          {open.signup ? "x" : "Join now"}
        </button>}


      {!open.signup &&
        <button className="trigger" onClick={() => { setOpen({ ...open, login: !open.login }); setProps({ opacity: !open.login ? 1 : 0, duration: 800 }) }}>
          {open.login ? "x" : "Log in"}
        </button>}

      <Animated.div style={props}>
        {open.signup && <Signup />}
        {open.login && <Login />}
      </Animated.div>
    </div>

  </>)
}


const LoggedInButtons = ({ username }) =>
  <div className="buttons logged-in">
    <h4>Welcome back, <p> {username}</p></h4>
    <div>Go to your <Button to={`/${username}/dashboard`} className="dashboard-button"><em>dashboard</em></Button></div>
    <div>or edit your <Button to={`/${username}/dashboard`} className="dashboard-button"><em>profile</em></Button></div>
  </div>;
