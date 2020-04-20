import React from 'react'
import styled from "styled-components"

import { Header } from "./Header"
import { useUserIsLoading } from "../api/auth.api"
const Background = styled.div`
background-image: linear-gradient(rgba(242,242,242,1) 75%,rgba(233,85,25,0.2),rgba(233,85,25,0.4),rgba(233,85,25,1));
width:100%;
height:100vh;

`
const Footer = styled.footer`
display:flex;
justify-content:center;
`


export const Layout = ({ children }) => (
  <Background>
    <Header />
    <div className="content-box">
      {children}
    </div>
    {useUserIsLoading && <Footer>&copy; Teresa Pelinski 2020</Footer>}
  </Background>
);


