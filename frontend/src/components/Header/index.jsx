/**
 * src/components/Header/index.jsx
 * logo
 *
 * created by lansane on 7/16/23
 */
/* eslint-disable */

import React,{ useState } from 'react';
import {useLocation} from 'react-router-dom'
import logo from '../../assets/svgs/logo.png';
import './style.css';
import SignIn from '../Auth/SignIn';
import SignOut from '../Auth/SignOut';
import { Navbar } from '@nextui-org/react';
import { useEffect } from 'react';
// const { asPath } = useRouter();
function Header({ user, isLoggedIn, setToken, handleDisconnect }) {
  const [index, setIndex] = useState(0);
  const pathName = useLocation();
  useEffect(()=>{
    if(pathName.pathname=='/'){
      setIndex(0);
    }else{
      setIndex(1);
    }
  },[pathName]);
  return (
  <Navbar id='navbar' variant='floating'>
    <a href='/'>
      <Navbar.Brand
        css={{
          '@xs': {
            w: '12%',
          },
        }}
      >
        <img src={logo} alt='Logo' />
      </Navbar.Brand>
    </a>
    <Navbar.Content activeColor="primary" hideIn="xs"
     css={{
      '@xs': {
        w: '60%',
        jc: 'flex-start',
      },
    }}
    >
       <Navbar.Link isActive={index==0} href='/'>
          Home
       </Navbar.Link>
       <Navbar.Link isActive={index==1}  href='/chat'>
          Chat
       </Navbar.Link>
    </Navbar.Content>
    <Navbar.Content
      id='navbar'
      css={{
        '@xs': {
          w: '19%',
          jc: 'flex-end',
        },
      }}
    >
      {user ? (
        <SignOut
          isLoggedIn={isLoggedIn}
          user={user}
          handleDisconnect={handleDisconnect}
        />
      ) : (
        <SignIn isLoggedIn={isLoggedIn} setToken={setToken} />
      )}
    </Navbar.Content>
  </Navbar>
);
}

export default Header;
