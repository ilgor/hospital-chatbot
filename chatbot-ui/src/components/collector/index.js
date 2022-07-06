import React from 'react'
import Bottom from '../bottom'
import Header from '../header'
import Main from '../main'
import { AiFillMessage as BotClosed, AiOutlineMessage as BotOpen } from "react-icons/ai";

import styled from 'styled-components';

const CollectorWrap = styled.div`
  display: flex;
  margin: 3rem;
  position: relative;
  z-index: 99;

  .bot-body {
    width: 400px;
    height: 500px;
    background-color: white;
    position: relative;
    border-radius: 10px;
    overflow: hidden;
  }

  .icon {
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: end;
    margin-left: 1rem;
  }

  .bot-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 4rem;
    width: 4rem;
    background-color: white;
    font-size: 2rem;
    color: rgb(13, 13, 78);
    border-radius: 50%;
  }

  @media only screen and (max-width: 540px) {
    & {
      margin: 0;
    }
    .collector {
      margin: 0;
      position: relative;
    }
    .icon {
      position: absolute;
      bottom: 1rem;
      right: 1rem;
      z-index: 1;
    }
    .bot-icon {
      background-color: rgb(213, 198, 198);
    }

    .bot-body {
      border-radius: 0;
      width: 100vw ;
      height: 100vh;
      z-index:99;
    }
  }
`;

const Collector = ({handleClick, handleAnswerClick, size, messages}) => {
  return (
    <CollectorWrap>
      <div
        className="bot-body"
        style={{ visibility: size ? "visible" : "hidden" }}
      >
        <Header handleClick={handleClick}/>
        <Main messages={messages} handleAnswerClick={handleAnswerClick}/>
        <Bottom handleAnswerClick={handleAnswerClick} />
      </div>
      <div className="icon">
        <div className="bot-icon" onClick={handleClick}>
          {size ? (
            <BotOpen className="bot-btn first" />
          ) : (
            <BotClosed className="bot-btn second" />
          )}
        </div>
      </div>
    </CollectorWrap>
  );
}

export default Collector