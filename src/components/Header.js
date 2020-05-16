import React, { useContext, useEffect } from 'react';
import "./Header.css"
import {Link} from "react-router-dom"
import { AppContext } from '../contexts/Appcontext';

const Header = () => {

    const {userId} = useContext(AppContext)

    return (
        <header className="header">
            <span className="header--left">
                <Link to="/" className="logo">
                    <img src={`${process.env.PUBLIC_URL}/logo.png`} alt=""/>
                </Link>
                <nav className="nav-bar">
                    <Link to="/bot">Discord Bot</Link>
                    <Link to="/apps">Apps</Link>
                    <Link to="/community">Community</Link>
                    <Link to="/about">About</Link>
                </nav>
            </span>
            <span className="header--right">
                {!userId ? <button className="login-button">
                    <a href={`https://discord.com/api/oauth2/authorize?client_id=${process.env.REACT_APP_DISCORD_ID}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Flogin&response_type=code&scope=identify%20guilds`}>Login</a>
                </button> : <div></div>}
            </span>
        </header>
    );
}

export default Header;
