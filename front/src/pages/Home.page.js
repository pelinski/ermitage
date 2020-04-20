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
  const propsFadeIn = useSpring({ opacity: 1, from: { opacity: 0 }, duration: 800 });

  return (
    <Animated.div id="home-page" style={{ ...propsFadeIn }} onMouseMove={({ clientX: x, clientY: y }) => set({ xy: calc(x, y) })}>
      <Logo {...{ propsParallax }} />
      <SubtitleHome {...{ propsParallax }} />
    </Animated.div>
  )
};


const Logo = ({ propsParallax }) => (
  <Animated.div className="logo" style={{ transform: propsParallax.xy.interpolate(trans(80, 30)) }}>
    <img src={logo} />
  </Animated.div>)



const SubtitleHome = ({ propsParallax }) => {
  const user = useUser();
  return (
    <div className="sub-title-home">
      <div className="text-col" style={{ overflow: "hidden" }}>
        <Animated.h2 style={{ transform: propsParallax.xy.interpolate(trans(-300, 100)) }}>
          The place to collect what inspires you. </Animated.h2>
        {!user && <AuthButtons {...{ propsParallax }} />}
        {user && <LoggedInButtons {...{ username: user.username }} />}
      </div>
      <Plane {...{ propsParallax }} />
    </div>)
}

const Plane = ({ propsParallax }) => (
  <Animated.div style={{ transform: propsParallax.xy.interpolate(trans(-300, 300)) }} className="map-col">
    <img src={plane} />
  </Animated.div>)

const AuthButtons = ({ propsParallax }) => (
  <Animated.div className="buttons" style={{ transform: propsParallax.xy.interpolate(trans(500, 100)) }}>
    <CollapsibleAuth />
  </Animated.div>)



const LoggedInButtons = ({ username }) =>
  <div className="buttons logged-in">
    <h4>Welcome back, <p> {username}</p></h4>
    <div>Go to your <Button to={`/${username}/dashboard`} className="dashboard-button"><em>dashboard</em></Button></div>
    <div>or edit your <Button to={`/${username}/dashboard`} className="dashboard-button"><em>profile</em></Button></div>
  </div>;
