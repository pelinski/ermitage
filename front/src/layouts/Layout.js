import React from 'react'
import styled from "styled-components"

const Background = styled.div`
background-image: linear-gradient(rgba(242,242,242,1) 75%,rgba(233,85,25,0.2),rgba(233,85,25,0.4),rgba(233,85,25,1));
width:100%;
height:100vh;

.line-box {
  margin:50px;
  height: 80%;
  border: 2px solid black;
  padding:20px;
}
`
const Footer = styled.footer`
display:flex;
justify-content:center;
`

export const Layout = ({ children }) => (
  <Background>
    <div className="line-box">
    <h2>Here comes the header</h2>
    {children}
    </div>
    <Footer>&copy; Teresa Pelinski 2020 || github</Footer>
  </Background>
);


