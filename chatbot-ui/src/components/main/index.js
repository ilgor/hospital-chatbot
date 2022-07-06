import React, {useEffect, useRef} from 'react'
import styled from 'styled-components'

const MainWrap = styled.div`
  .main {
    /* scroll bar hide */
    -ms-overflow-style: none; // IE 10+
    overflow: -moz-scrollbars-none;

    position: absolute;
    left: -1.6rem;
    right: 0.5rem;
    top: 100px;
    bottom: 3rem;
    margin: 0 !important;
    padding-left: 0 !important;
    height: auto;
    overflow: auto;
  }
  
  /* scroll bar hide */
  .main::-webkit-scrollbar {
    display: none;
  }

  .main-content {
    width: auto;
    list-style: none;
    margin: 0 !important;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .main-content li:first-child {
    margin-top: 0.5rem;
  }

  .msg {
    padding: 5px 5px;
    min-width: 0;
    max-width: 60%;
    font-style: 1.1em;
    margin-bottom: 0.5rem;
  }
  .left {
    border-radius: 10px 10px 10px 0px;
    background-color: #edeced;
    text-align: left;
    margin-left: 0.5rem;
    margin-right: auto;
  }
  .right {
    border-radius: 10px 10px 0px 10px;
    background-color: #000066;
    color: white;
    text-align: right;
    margin-left: auto;
    margin-right: 0.5rem;
  }
  .option {
    width: 60%;
    padding: .4rem;
    background: #fff;
    border: 1px solid blue;
    border-radius: 20px;
    text-align: center;
    cursor: pointer;
    margin-bottom: 0.5rem;
  }
`;

const Main = ({messages, handleAnswerClick}) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    //scroll to bottom when a message is sent or received
    if (messages.length > 1) {
      scrollToBottom();
    }
  });

  function scrollToBottom() {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }
  return (
    <MainWrap>
      <div className="main">
        <ul className="main-content">
          {messages.map((msg, i) => (
            <div>
              <li className={`msg ${msg.position}`}>
                <span>{msg.text}</span>
              </li>
              {msg.list?.map((item) => (
                <li className="option" onClick={() => handleAnswerClick(item)}>{item}</li>
              ))}
            </div>
          ))}

          <li ref={messagesEndRef} />
        </ul>
      </div>
    </MainWrap>
  );
}

export default Main