import React, {useContext} from 'react';
import "./Home.css"

import {Link} from "react-router-dom"
import { useTitle } from 'react-use';
import { AppContext } from '../../contexts/Appcontext';
const Home = () => {

    useTitle("DisTwitchChat")

    const {currentUser} = useContext(AppContext)
    return (
        <>
            <div className="header-area">
                <h1 className="body-header">Integrate your Discord server with Twitch</h1>
                <h3 className="body-subheader">Chat, QnAs, Polls, Games and much more easily Integrated with Twitch and Discord!</h3>
            </div>
            <div className="buttons">
                {!currentUser ? 
                    <>
                        <Link to="/invite" target="_blank" rel="noreferrer noopener" className="main-button discord-button">Login</Link>
                        <Link to="/about" className="main-button about-button">See Features</Link>
                    </> :
                    <Link to="/dashboard" className="dashboard-button">My DashBoard</Link>
                }
            </div>
        </>
    );
}

export default Home;
