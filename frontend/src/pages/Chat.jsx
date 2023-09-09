/**
 * src/pages/Home.jsx
 *
 * created by lansane on 7/28/23
 */
/* eslint-disable */
import React, { useState, useRef, useEffect } from 'react';
import { isIP } from 'is-ip';
import { useNavigate } from 'react-router-dom';
import lz from 'lz-string';

import Characters from '../components/Characters';
import Button from '@mui/material/Button';
import { getHostName } from '../utils/urlUtils';
import { signInWithGoogle } from '../components/Auth/SignIn';

const Chat = ({
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
  connect,
  send,
  setIsCallView
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const  preferredLanguage ='English'
  const  selectedDevice="default"
  const  selectedModel="gpt-4"
  const  useSearch=false;
  const   useMultiOn=false
  const  useEchoCancellation=false
  // Get characters
  useEffect(() => {
    setLoading(true);

    // Get host
    const scheme = window.location.protocol;
    const url = scheme + '//' + getHostName() + '/characters';
    let headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    fetch(url, {
      method: 'GET',
      headers: headers,
    })
      .then(response => response.json())
      .then(data => {
        setCharacterGroups(data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.error(err);
      });
  }, [setCharacterGroups, token]);

  // const handleNextClick = () => {
  //   setCharacterConfirmed(true);
  //   const compressedCharacter = lz.compressToEncodedURIComponent(
  //     JSON.stringify(selectedCharacter)
  //   );
  //   navigate('/settings?character=' + compressedCharacter);
  // };

  const handleStartClick = async () => {
    setCharacterConfirmed(true);
    const compressedCharacter = lz.compressToEncodedURIComponent(
      JSON.stringify(selectedCharacter)
    );
    await connect();

    // TODO(UI): Show loading animation

    const interval = setInterval(() => {
      // display callview
      setIsCallView(false);

      // shouldPlayAudio.current = true;
      clearInterval(interval);

      // TODO(UI): Hide loading animation
    }, 500);
  
    navigate(
      '/conversation?isCallViewParam=false'+
        '&character=' +
        compressedCharacter +
        '&preferredLanguage=' +
        preferredLanguage +
        '&selectedDevice=' +
        (selectedDevice || 'default') +
        '&selectedModel=' +
        selectedModel +
        '&useSearchParam=' +
        useSearch +
        '&useMultiOnParam=' +
        useMultiOn +
        '&useEchoCancellationParam=' +
        useEchoCancellation
    );
  };

  return (
    <div className='home'>
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <>
          <p className='header'>Choose Your Partner</p>

          <Characters
            isMobile={isMobile}
            characterGroups={characterGroups}
            selectedCharacter={selectedCharacter}
            setSelectedCharacter={setSelectedCharacter}
            isPlaying={isPlaying}
            characterConfirmed={characterConfirmed}
          />
       

          <Button
            variant='contained'
            onClick={handleStartClick}
            fullWidth
            size='large'
            disabled={!selectedCharacter}
            sx={{
              '&.Mui-disabled': {
                backgroundColor: '#BEC5D9',
                color: '#636A84',
              },
              textTransform: 'none',
            }}
          >
            Chat
          </Button>
        </>
      )}
    </div>
  );
};

export default Chat;
