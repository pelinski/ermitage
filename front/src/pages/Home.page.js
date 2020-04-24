import React, { useState, useEffect } from "react"
import { useSpring, animated as Animated } from 'react-spring'

import { calc, trans } from "../lib/parallax"
import { useUser, useUserIsLoading } from "../api/auth.api"

import logo from "../public/home-logo.svg"
import plane from "../public/hermitage-home.svg"
import { Signup, Login } from "../components/Auth"
import { LoggedinNav } from "../components/Nav"
import { DeleteIcon } from "../components/Icons"



export const HomePage = () => {

  const user = useUser();
  const [start, setStart] = useState(true);
  const startTrans = useSpring({ opacity: 1, marginTop: "2vh", from: { opacity: 0.5, marginTop: "20vh" }, duration: 800 });

  const spring = { mass: 30, tension: 550, friction: 130 };
  const [parallax, set] = useSpring(() => ({ xy: [0, 0], config: spring }));
  const [fadeIn, setFadeIn] = useSpring(() => ({ opacity: 0 }));

  // Start logo translation
  useEffect(() => {
    const timer = setTimeout(() => {
      setStart(false)
      setFadeIn(() => ({ opacity: 1, marginLeft: "0vh", from: { opacity: 0.5, marginLeft: "100vw" }, duration: 800, config: spring }))
    }, 1000);
    return () => clearTimeout(timer);
  }, [useUserIsLoading]);


  if (start) {
    return (
      <div className="home-fade-in" >
        <div className="logo" >
          <Animated.img style={startTrans} src={logo} />
        </div >
      </div>
    )
  } else {
    return (
      <Animated.div id="home-page" onMouseMove={({ clientX: x, clientY: y }) => set({ xy: calc(x, y) })}>

        <Animated.div className="logo" style={{ transform: parallax.xy.interpolate(trans(80, 30)) }}
        >
          <img src={logo} />
        </Animated.div>
        <Animated.div style={fadeIn} className="sub-title-home">
          <Animated.div className="auth-col" style={{ transform: parallax.xy.interpolate(trans(500, 100)) }}>
            {!user && <AuthButtons {...{ fadeIn, parallax }} />}
            {user && <LoggedInPanel {...{ username: user.username }} />}
          </Animated.div>
          <Animated.img style={{ transform: parallax.xy.interpolate(trans(-300, 300)) }} className="map-col" src={plane} />

        </Animated.div >
      </Animated.div >
    )
  }
};

const AuthButtons = ({ fadeIn, parallax }) => {
  const [open, setOpen] = useState({ login: false, signup: false });
  const [props, setProps] = useSpring(() => ({ opacity: 0, duration: 800 }));

  return (<>
    {(open.signup || open.login) && <Animated.h2 style={{ ...props, transform: parallax.xy.interpolate(trans(-300, 100)) }}>The place to collect <br /> what inspires you.</Animated.h2>}
    {!(open.signup || open.login) && <Animated.h2 style={{ ...fadeIn, transform: parallax.xy.interpolate(trans(-300, 100)) }}>The place to collect <br />what inspires you.</Animated.h2>}

    <div className="Collapsible auth-collapsible">

      {!open.login &&
        <button className="trigger" onClick={() => { setOpen({ ...open, signup: !open.signup }); setProps({ opacity: !open.signup ? 1 : 0, duration: 800 }) }}>
          {open.signup ? <DeleteIcon /> : <u>Join now</u>}
        </button>}
      {open.signup || open.login ? "" : "and start your archive or if you already have an account, "}

      {!open.signup &&
        <button className="trigger" onClick={() => { setOpen({ ...open, login: !open.login }); setProps({ opacity: !open.login ? 1 : 0, duration: 800 }) }}>
          {open.login ? <DeleteIcon /> : <u>log in</u>}
        </button>}

      <Animated.div style={props}>
        {open.signup && <Signup />}
        {open.login && <Login />}
      </Animated.div>
    </div>

  </>)
}

const LoggedInPanel = ({ username }) => (
  <div className="logged-in-panel">
    <h1>Welcome back,  {username}</h1>
    <LoggedinNav />
  </div>)

  ;
