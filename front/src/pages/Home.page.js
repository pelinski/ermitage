import React from "react"
import { useSpring, animated as Animated } from 'react-spring'


import { calc, trans } from "../lib/parallax"
import { useUser } from "../api/auth.api"

import { Button } from "../components/Buttons"

import logo from "../public/home-logo.svg"
import plane from "../public/hermitage-home.svg"
import { CollapsibleAuth } from "../components/Collapsible"


export const HomePage = () => {
  const [propsParallax, set] = useSpring(() => ({ xy: [0, 0], config: { mass: 10, tension: 550, friction: 140 } }));
  const props = useSpring({ opacity: 1, from: { opacity: 0 }, duration: 800 });

  return (
    <Animated.div style={{ ...props, overflow: "hidden" }} onMouseMove={({ clientX: x, clientY: y }) => set({ xy: calc(x, y) })}>
      <Logo {...{ propsParallax, trans: trans(80, 30) }} />
      <SubtitleHome {...{ props, propsParallax, transAuth: trans(500, 100) }} />
    </Animated.div>
  )
};


const Logo = ({ propsParallax, trans }) => (
  <Animated.div style={{ transform: propsParallax.xy.interpolate(trans), padding: "0 2vw" }}>
    <img src={logo} />
  </Animated.div>)



const SubtitleHome = ({ props, propsParallax, transAuth }) => {
  const user = useUser();
  return (
    <div className="sub-title-home">
      <div className="text-col" style={{ overflow: "hidden" }}>
        <h1>The place to collect what inspires you.</h1>
        {!user && <AuthButtons {...{ propsParallax }} trans={transAuth} />}
        {user && <LoggedInButtons {...{ username: user.username }} />}
      </ div>
      <Plane {...{ props }} />
    </div>)
}

const Plane = ({ props }) => (
  <Animated.div style={props} className="map-col">
    <img src={plane} />
  </Animated.div>)

const AuthButtons = ({ propsParallax, trans }) => (
  <Animated.div className="buttons" style={{ transform: propsParallax.xy.interpolate(trans) }}>
    <CollapsibleAuth />
  </Animated.div>)



const LoggedInButtons = ({ username }) =>
  <div className="buttons logged-in">
    <h4>Welcome back, <p> {username}</p></h4>
    <div>Go to your <Button to={`/${username}/dashboard`} className="dashboard-button"><em>dashboard</em></Button></div>
    <div>or edit your <Button to={`/${username}/dashboard`} className="dashboard-button"><em>profile</em></Button></div>
  </div>;
