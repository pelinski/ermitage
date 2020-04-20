import React, { useState, useEffect } from "react"
import { useSpring, animated as Animated } from 'react-spring'

import { calc, trans } from "../lib/parallax"
import { useUser, useUserIsLoading } from "../api/auth.api"

import { Button } from "../components/Buttons"

import logo from "../public/home-logo.svg"
import plane from "../public/hermitage-home.svg"
import { Signup, Login } from "../components/Auth"


export const HomePage = () => {
  const [propsParallax, set] = useSpring(() => ({ xy: [0, 0], config: { mass: 30, tension: 550, friction: 130 } }));
  const [propsFadeIn, setFadeIn] = useSpring(() => ({ opacity: 0 }));
  const props = useSpring({ opacity: 1, marginTop: "1vh", from: { opacity: 0.5, marginTop: "20vh" }, duration: 800 });
  const [start, setStart] = useState(true);
  const user = useUser();
  useEffect(() => {
    const timer = setTimeout(() => {
      setStart(false)
      setFadeIn(() => ({ opacity: 1, marginTop: "0vh", from: { opacity: 0.5, marginTop: "60vh" }, duration: 1000 }))
    }, 1000);
    return () => clearTimeout(timer);
  }, [useUserIsLoading]);
  if (start) {
    return (

      <div className="home-fade-in" >
        <div className="logo" >
          <Animated.img style={props} src={logo} />
        </div >
      </div>
    )
  } else {
    //style={{ transform: propsParallax.xy.interpolate(trans(80, 30)) }}
    return (
      <Animated.div id="home-page" onMouseMove={({ clientX: x, clientY: y }) => set({ xy: calc(x, y) })}>

        <Animated.div className="logo" >
          <img src={logo} />
        </Animated.div>
        <Animated.div style={propsFadeIn} className="sub-title-home">
          <Animated.div className="auth-col" style={{ transform: propsParallax.xy.interpolate(trans(500, 100)) }}>
            {!user && <AuthButtons {...{ propsFadeIn, propsParallax }} />}
            {user && <LoggedInButtons {...{ username: user.username }} />}
          </Animated.div>
          <Animated.img style={{ transform: propsParallax.xy.interpolate(trans(-300, 300)) }} className="map-col" src={plane} />

        </Animated.div >
      </Animated.div >
    )
  }
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
