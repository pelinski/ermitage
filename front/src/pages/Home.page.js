import React from "react"
import { useSpring, animated as Animated } from 'react-spring'

import { Button } from "../components/Buttons"

import logo from "../public/home-logo.svg"
import plane from "../public/hermitage-home.svg"


export const HomePage = () => {

  const [propsParallax, set] = useSpring(() => ({ xy: [0, 0], config: { mass: 10, tension: 550, friction: 140 } }))
  const calc = (x, y) => [x - window.innerWidth / 2, y - window.innerHeight / 2];
  const trans1 = (x, y) => `translate3d(${x / 80}px,${y / 30}px,0)`
  const trans2 = (x, y) => `translate3d(${-x / 500}px,${y / 100}px,0)`
  const props = useSpring({ opacity: 1, from: { opacity: 0 }, duration: 800 });

  return (<>
    <Animated.div style={{ ...props, overflow: "hidden" }} onMouseMove={({ clientX: x, clientY: y }) => set({ xy: calc(x, y) })}>
      <Logo {...{ propsParallax }} trans={trans1} />
      <SubtitleHome {...{ props, propsParallax, transAuth: trans2 }} />
    </Animated.div>
  </>
  )
};

const AuthButtons = ({ propsParallax, trans }) => (
  <Animated.div className="buttons" style={{ transform: propsParallax.xy.interpolate(trans) }}>
    <Button to="/signup"><em>Join now</em></Button>
    <p>or</p>
    <Button to="/login"><em>Log in</em></Button>
  </Animated.div>)

const Logo = ({ propsParallax, trans }) => (
  <Animated.div style={{ transform: propsParallax.xy.interpolate(trans), padding: "0 2vw" }}>
    <img src={logo} />
  </Animated.div>)

const Plane = ({ props }) => (
  <Animated.div style={props} className="map-col">
    <img src={plane} />
  </Animated.div>)

const SubtitleHome = ({ props, propsParallax, transAuth }) => (
  <div className="sub-title-home">
    <div className="text-col" style={{ overflow: "hidden" }}>
      <h1>The place to collect what inspires you.</h1>
      <AuthButtons {...{ propsParallax }} trans={transAuth} />
    </ div>

    <Plane {...{ props }} />

  </div>)