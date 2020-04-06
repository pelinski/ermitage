import React from "react";
import styled from "styled-components";
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
   <Spinner name="triangle-skew-spin" color="black"/>
  </LoadingWrapper>
);
