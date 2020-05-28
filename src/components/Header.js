import React, { useContext, useEffect, useState } from 'react';
import "./Header.css"
import {Link, withRouter} from "react-router-dom"
import { AppContext } from '../contexts/Appcontext';
import {CSSTransition} from "react-transition-group"
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { useCallback } from 'react';
import Modal from "react-modal"
import YouTubeIcon from '@material-ui/icons/YouTube';
import A from './Shared/A';
import ClearIcon from '@material-ui/icons/Clear';
import firebase from "../firebase"
import HamburgerMenu from "react-hamburger-menu"

Modal.setAppElement('#root');

const Header = props => {

    const {currentUser, setCurrentUser} = useContext(AppContext)
    const {dropDownOpen: open, setDropDownOpen: setOpen} = useContext(AppContext);
    const [userDropDown, setUserDropDown] = useState(false)
    const [loginOpen, setLoginOpen] = useState(false)

    useEffect(() => {
        const codeArray = window.location.search.slice(1).split("&").map(item => item.split("=")).filter(item => item[0] === "code")
        console.log(codeArray)
        if (codeArray.length > 0) {
            (async () => {
                const code = codeArray[0][1]
                const apiURL = `https://id.twitch.tv/oauth2/token?client_id=${process.env.REACT_APP_TWITCH_APP_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLIENT_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}`
                console.log(apiURL)
                try {
                    const response = await fetch(apiURL, {
                        method: "POST"
                    })
                    const json = await response.json()
                    console.log(json)
                    const validationResponse = await fetch("https://id.twitch.tv/oauth2/validate", {
                        headers: {
                            Authorization: `OAuth ${json.access_token}`
                        }
                    })
                    const validationJson = await validationResponse.json()
                    console.log(validationJson)
                    // localStorage.setItem("tokenData", JSON.stringify())
                    // window.location = "/"
                } catch (err) {
                    alert(err.message)
                }
            })()
        }
    }, [])

    useEffect(() => {
        setUserDropDown(d => d && !!currentUser)
    }, [currentUser])

    const signIn = useCallback(() => {
        setCurrentUser({
            profilePicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/9e40522b-dca4-4e2e-9aa0-ccfa6550e208-profile_image-300x300.png",
            name: "Dav1dSnyder404",
            id: "fvgFceTbjX67vmEYPzeR"
        })
    }, [setCurrentUser])

    const signInWithGoogle = useCallback(async () => {
        const provider = new firebase.app.auth.GoogleAuthProvider()
        try{
            const result = await firebase.auth.signInWithPopup(provider)
            signIn()
            setLoginOpen(false)
        }catch(err){
            console.log(err.message)
        }
    }, [signIn])


    return (
        <header className="header">
            <Modal
                isOpen={loginOpen}
                className="Modal"
                overlayClassName="Modal-Overlay"
                onRequestClose={() => setLoginOpen(false)}
            >
                <button className="exit-button" onClick={() => setLoginOpen(false)}><ClearIcon/></button>
                <h1 className="modal-heading">Login to DisTwitchChat</h1>
                <h2 className="modal-subheading">Connect with:</h2>
                <div className="modal-buttons">
                    <A href={`https://id.twitch.tv/oauth2/authorize?client_id=ip3igc72c6wu7j00nqghb24duusmbr&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&response_type=code&scope=openid%20moderation:read`} className="modal-button twitch"><img src={`${process.env.PUBLIC_URL}/social-media.svg`} alt="" width="20" className="logo-icon" />Twitch</A>
                    <div className="modal-button youtube" onClick={signInWithGoogle}><YouTubeIcon className="logo-icon yt-icon" />YouTube</div>
                </div>
            </Modal>
            <div className="hamburger-holder">
                <HamburgerMenu
                    isOpen={open}
                    menuClicked={() => setOpen(u => !u)}
                    strokeWidth={3}
                    rotate={0}
                    color='white'
                    borderRadius={5}
                    animationDuration={0.5}
                />
            </div>
            <span className="header--left">
                <Link to="/" className="logo">
                    <img src={`${process.env.PUBLIC_URL}/logo.png`} alt=""/>
                </Link>
                <nav className={`nav-bar ${open && "open"}`}>
                    <Link to="/bot">Discord Bot</Link>
                    <Link to="/apps">Apps</Link>
                    <Link to="/community">Community</Link>
                    <Link to="/about">About</Link>
                </nav>
            </span>
            <span className="header--right">
                {!currentUser ? 
                    <button className="login-button" onClick={() => setLoginOpen(true)}>
                        {/* <a href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.REACT_APP_DISCORD_ID}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=code&scope=identify%20guilds`}>Login</a> */}
                        Login
                    </button> : 
                    <ClickAwayListener onClickAway={() => setUserDropDown(false)}>
                    <div className="full-user">
                        <button className="user" onClick={() => setUserDropDown(d => !d)}>
                            <span className="user--name">{currentUser.name}</span>
                            <img className="profile-picture" src={currentUser.profilePicture} alt=""></img>
                        </button>
                        <CSSTransition unmountOnExit in={userDropDown} timeout={200} classNames="user-node">
                            <div className="user-dropdown">
                                <Link onClick={() => setUserDropDown(false)} to={`/dashboard/${currentUser.name.toLowerCase()}`} className="user-item">Dashboard</Link>
                                <Link onClick={() => setUserDropDown(false)} to="/my-channels" className="user-item">My Channels</Link>
                                <div onClick={() => setCurrentUser(null)} className="user-item logout">Logout</div>
                            </div>
                        </CSSTransition>
                    </div>
                    </ClickAwayListener>
                }
            </span>
        </header>
    );
}

export default withRouter(Header);