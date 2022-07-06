import React from "react";
import styled from "styled-components";
import Animation from "../animation";

const InfoWrap = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  background-color: #000044;
  text-align: center;
  opacity: 0.6;
  color: white;
`;

const Info = () => {
  return (
    <InfoWrap>
      <h1>INTERNET TECHNOLOGIES</h1>
      <h3>HOSPITAL APPOINTMENT CHATBOT</h3>
      <p>Team: GRIFFINS</p>
      <Animation />
    </InfoWrap>
  );
};

export default Info;
