/**
 * src/pages/Home.jsx
 *
 * created by lansane on 7/28/23
 */

import React, { useState, useRef, useEffect } from 'react';
import { isIP } from 'is-ip';
import { useNavigate } from 'react-router-dom';
import lz from 'lz-string';


import { getHostName } from '../utils/urlUtils';
import  CodeHighlight  from '../utils/CodeHighlight';
import {SendServerRequest} from '../utils/SendServerRequest'
import {StreamResponse} from '../utils/StreamResponse'
import { signInWithGoogle } from '../components/Auth/SignIn';
import { Card, Text,Container,Row,Col ,Image,Spacer,Button,Input,useInput  } from "@nextui-org/react";
import chagpt from '../assets/images/chatgpt.jpg';
import ReactMarkdown from 'react-markdown';
 
// import {fetchEventSource} from "@microsoft/fetch-event-source"

const Home = ({
  isMobile,
  selectedCharacter,
  setSelectedCharacter,
  isPlaying,
  characterGroups,
  setCharacterGroups,
  setCharacterConfirmed,
  characterConfirmed,
  token,
  setToken,
  isLoggedIn,
}) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [content,setContent] = useState("");
  const [showContent,setShowContent] = useState("none");
  const [isThinking,setIsThinking] = useState(false);
  const { value, reset, bindings } = useInput("");
  const [messages, setMessages] = useState([]);

  const scheme = window.location.protocol;
  const url = scheme + '//' + getHostName() + '/search';
  // const evtSource = new EventSource("http://127.0.0.1:8000/stream");
  const handleNextClick = () => {
    setCharacterConfirmed(true);
    const compressedCharacter = lz.compressToEncodedURIComponent(
      JSON.stringify(selectedCharacter)
    );
    navigate('/settings?character=' + compressedCharacter);
  };

  const handleOnKeyDown=async (event)=>{
      if(event.charCode ==13){
        setIsThinking(true)
        const response = await SendServerRequest(url,messages,value,token);
        setContent("thinking....")
        setMessages([...messages, { role: 'user', content: value }]);
        // debugger()
        if (response.ok) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder('utf-8');
    
          await StreamResponse(reader, decoder, setMessages,setContent);
        } else {
          console.error(`Error: ${response.status}`);
        }
        setIsThinking(false)
      }
  }
  const handleChatButtonClick = ()=>{
    navigate('/chat');
  }

  return (
    <div className='home1'>
       <Container alignContent='flex-start' >
         <Row>
           <Col span={7}>
             <Row>
              <Card css={{ $$cardColor: '$colors$pri1mary' }}>
                  <Card.Body>
                  <Row justify="left" align="left">
                      <Text h1 color="white">
                      Tools Recommendation
                      </Text>
                    </Row>
                    <Row justify="left" align="left">
                      <Text  size={15} color="white" css={{ m: 0 }}>
                      Tell me your demand and I will help you find perfect Web3 tools, platforms, even DAOs for you.
                      </Text>
                    </Row>
                    <Row justify="left" align="left">
                      <Text h1 color="white">
                      AI-Selected News
                      </Text>
                    </Row>
                    <Row justify="left" align="left">
                      <Text  size={15} color="white" css={{ m: 0 }}>
                      Overwhelmed by tons of Web3 News and Articles everyday? Let AI help you.                      </Text>
                    </Row>
                    <Row justify="left" align="left">
                      <Text h1 color="white">
                      Your 24*7 Analyst                      </Text>
                    </Row>
                    <Row justify="left" align="left">
                      <Text  size={15} color="white" css={{ m: 0 }}>
                      Explain new Web3 concepts or tech detials for you anytime anywhere                      </Text>
                    </Row>
                  </Card.Body>
              </Card>
           </Row>
           <Spacer y={4} />
           <Row justify="flex-end" align="flex-end">
           <Button onPress= {handleChatButtonClick}>Explore By Chat </Button>
           </Row>
           </Col>
           <Spacer x={3} />
           <Col span={4}>  
             <Image  src={chagpt} autoResize></Image >
           </Col>
         </Row>
         <Row align="center" justify="center">
         <Text h2 color="white">Explore Your Answer</Text>
         </Row>
         <Row justify="flex-start" width='100%'>
         <Input 
          {...bindings}
          disabled ={isThinking}
          onKeyPress = {handleOnKeyDown}
           width='100%'
          type="search" 
          placeholder= "Input your question and press enter"
        />
         </Row>
       
         {/* <Card css={{ $$cardColor: '$#03091E' }} borderWeight>
                  <Card.Body>
                      <Text  size={15} color="white" css={{ m: 0 }}>
                      {content}
                      </Text>
                  </Card.Body>
              </Card> */}
          <ReactMarkdown components={{ code: CodeHighlight }}>{content}</ReactMarkdown>
        
       </Container>
    </div>
  );
};

export default Home;
