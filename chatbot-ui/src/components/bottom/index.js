import React, { useState } from "react";
// import "./bottom.css";
import { RiSendPlaneFill as Send } from "react-icons/ri";
import styled from "styled-components";

const BottomWrap = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0;
  z-index: 999;

  .bottom-body {
    display: flex;
    height: 3rem;
  }

  .input-wrap {
    width: 100%;
    flex: 3;
    display: flex;
    background-color: #fff;
    padding: 1rem;
    border-top: 1px solid #000066;
  }

  input {
    width: 100%;
    border: none;
    outline: none;
  }

  .btn {
    width: 100%;
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: #000066;
    color: white;
  }
  button {
    background: inherit;
    border: none;
    color: inherit;
    cursor: pointer;
  }
`;

const Bottom = ({handleAnswerClick}) => {
  const [msg, setMsg] = useState("");
  
  const handleChange = (e) => {
    setMsg(e.target.value)
  }

  return (
    <BottomWrap>
      <div className="bottom-body">
        <div className="input-wrap">
          <input
            type="text"
            name="input"
            placeholder={msg === "" && "Write your message"}
            value={msg}
            onChange={handleChange}
          />
        </div>
        <div
          className="btn"
          onClick={() => {
            handleAnswerClick(msg);
            setMsg("");
            console.log(msg);
          }}
        >
          <Send />
          <button>Send</button>
        </div>
      </div>
    </BottomWrap>
  );
};

export default Bottom;
