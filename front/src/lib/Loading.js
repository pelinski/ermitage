import React from "react";
import styled from "styled-components";
import logo from "../public/home-logo.svg"
import { useSpring, animated as Animated } from 'react-spring'


import Spinner from "react-spinkit"

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  position: absolute;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.5);
`;


export const Loading = () => (
  <LoadingWrapper>
    <Spinner name="triangle-skew-spin" color="black" />
  </LoadingWrapper>
);
/*
export const Loading = () => {
  const props = useSpring({ opacity: 0, marginTop: "40vh", from: { opacity: 0.5, marginTop: "80vh" }, duration: 100 });
  return (
    <div id="loading-background">
      <Animated.img style={props} src={logo} />
    </div>
  )
}*/