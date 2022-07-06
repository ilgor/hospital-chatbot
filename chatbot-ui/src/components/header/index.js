import React from "react";
import image from "../../assets/background_img.jpeg";
import styled from "styled-components";
import { CgClose as CloseIcon } from "react-icons/cg";


const HeaderWrap = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #000066;
  z-index: 100;

  .header {
    display: flex;
    align-items: center;
    letter-spacing: 0.3px;

    color: white;
    padding: 0.6rem 0.6rem;

    img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 50%;
    }
  }

  .right {
    margin-left: 10px;
  }
  .name {
    font-weight: normal;
    font-size: 1.2em;
  }
  .status {
    font-weight: 500;
    color: #615a93;
  }
  .exit-icon {
    padding: 2rem;
    color: rgb(255, 255, 255) !important;

    .icon1 {
      font-size: 2rem;
      color: white;
    }
  }
  @media only screen and (max-width: 540px) {
    display: flex;
    align-items: center;
    justify-content: space-space-between;
    .exit-icon > .icon {
      font-size: 2rem;
      
    }
  }
`;

const Header = ({handleClick}) => {
  return (
    <HeaderWrap>
      <div className="header">
        <div className="img">
          <img src={image} alt="background" />
        </div>
        <div className="right">
          <div className="name">Chatbot</div>
          <div className="status">Active</div>
        </div>
      </div>
      <div className="exit-icon">
        <CloseIcon className="icon1" onClick={handleClick} />
      </div>
    </HeaderWrap>
  );
};

export default Header;
