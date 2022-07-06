import Collector from "./components/collector";
import Info from "./components/info";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import bgImage from "./assets/hospital_image.jpeg";

import { io } from "socket.io-client";
const socket = io("ws://localhost:3000");

const AppWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: end;
  align-items: end;
  background-image: url("${bgImage}");
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  position: relative;
`;


function App() {
  // states
  const [size, setSize] = useState(false); // to resize the chat body
  const [messages, setMessages] = useState([
    {
      text: "Hello, I am the Hospital ChatBot, how can I help You?",
      position: "left",
      list: []
    },
  ]);
  
  useEffect(() => {
    //if last message is a non-empty question, ask the server
    let lastMessage = messages[messages.length - 1];
    if (lastMessage.text !== "" && lastMessage.position === "right") {
      socket.emit("client message", lastMessage.text);
    }

    //handle server responses
    socket.on("bot message", (data) => {
      console.log(data)
      const tempData = data.split("#")
      if(tempData.length === 1){
        setMessages([...messages, { text: tempData[0], position: "left" }]);
      }else{
        const tempList = tempData[1].split(",");
        setMessages([...messages, { text: tempData[0], list: tempList, position: "left" }]);
      }
    });
  }, [messages]);

  
  const handleClick = (e) => {
    setSize(!size);
  };

  const handleAnswerClick = (msg) => {
    console.log(msg)
    if (msg !== ""){
      setMessages([...messages, { text: msg, position: "right" }]);
    }
  }

  return (
      <AppWrapper>
        <Info />
        <Collector size={size} handleClick={handleClick} handleAnswerClick = {handleAnswerClick} messages={messages}/>
      </AppWrapper>
  );
}

export default App;
