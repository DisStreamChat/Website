import React, { useContext, useEffect, useState } from 'react';
import "./Header.css"
import {Link, withRouter} from "react-router-dom"
import { AppContext } from '../contexts/Appcontext';
import {CSSTransition} from "react-transition-group"
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const Header = props => {

    const {currentUser, setCurrentUser} = useContext(AppContext)
    const {dropDownOpen: open, setDropDownOpen: setOpen} = useContext(AppContext);
    const [userDropDown, setUserDropDown] = useState(false)

    // useEffect(() => {
    //     const codeArray = window.location.search.slice(1).split("&").map(item => item.split("=")).filter(item => item[0]==="code")
    //     console.log(codeArray)
    //     if (codeArray.length > 0){
    //         (async () => {
    //             const code = codeArray[0][1]
    //             try{
    //                 const tokenData = await oauth.tokenRequest({
    //                     clientId: process.env.REACT_APP_DISCORD_ID,
    //                     clientSecret: process.env.REACT_APP_DISCORD_SECRET,

    //                     code: code,
    //                     scope: "identify guilds",
    //                     grantType: "authorization_code",

    //                     redirectUri: "http://localhost:3000/login",
    //                 })
    //                 localStorage.setItem("tokenData", JSON.stringify(tokenData))
    //                 window.location = "/"
    //             }catch(err){
    //                 alert(err.message)
    //             }
    //         })()
    //     }
    // }, [])

    useEffect(() => {
        setUserDropDown(d => d && !!currentUser)
    }, [currentUser])

    return (
        <header className="header">
            <div className="hamburger-holder">
                <button className="hamburger-button" onClick={() => setOpen(o => !o)}>
                    <span className={`bar ${open && "open"}`} id="bar-1"></span>
                    <span className={`bar ${open && "open"}`} id="bar-2"></span>
                    <span className={`bar ${open && "open"}`} id="bar-3"></span>
                </button>
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
                    <button className="login-button">
                        <a href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.REACT_APP_DISCORD_ID}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=code&scope=identify%20guilds`}>Login</a>
                    </button> : 
                    <ClickAwayListener onClickAway={() => setUserDropDown(false)}>
                    <div className="full-user">
                        <button className="user" onClick={() => setUserDropDown(d => !d)}>
                            <span className="user--name">{currentUser.name}</span>
                            <img className="profile-picture" src={currentUser.profilePicture} alt=""></img>
                        </button>
                        <CSSTransition unmountOnExit in={userDropDown} timeout={200} classNames="user-node">
                            <div className="user-dropdown">
                                <Link onClick={() => setUserDropDown(false)} to="/dashboard" className="user-item">Dashboard</Link>
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
