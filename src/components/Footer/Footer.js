import React from 'react';

import "./Footer.css"
import TwitterIcon from '@material-ui/icons/Twitter';
import GitHubIcon from '@material-ui/icons/GitHub';
import {Link} from "react-router-dom"
import A from "../Shared/A"
import { useContext } from 'react';
import { AppContext } from '../../contexts/Appcontext';

const Footer = () => {

    const {dropDownOpen} = useContext(AppContext)

    return (
        <footer className={`footer ${dropDownOpen && "open"}`}>
            <div className="footer-top">
                <section className="left">
                    <h3>The best Twitch/Discord Integration</h3>
                    <h4>DisTwitchChat is the easiest way to link your Discord with Twitch chat</h4>
                    <A href="https://github.com/DisStreamChat" newTab><GitHubIcon /></A>
                    <A href="https://twitter.com/Snyderling_" newTab><TwitterIcon /></A>
                </section>
                <section className="right">
                    <div className="column">
                        <span className="column-header">Product</span>
                        <A href={`https://discord.com/api/oauth2/authorize?client_id=702929032601403482&permissions=0&scope=bot`} newTab>Add To Discord</A>
                        <Link to="/apps">Check out the Apps</Link>
                    </div>
                    <div className="column">
                        <span className="column-header">Resources</span>
                        <A href="https://discord.gg/sFpMKVX" newTab>Join The Discord</A>
                        <A href="https://github.com/DisStreamChat" newTab>Get Help on GitHub</A>
                        <Link to="/faq">FAQ</Link>
                    </div>
                    <div className="column last-column">
                        <span className="column-header">Team</span>
                        <Link to="/members">Members</Link>
                        <A href="https://github.com/DisStreamChat/Contributors" newTab>Contributors</A>
                    </div>
                </section>
            </div>
            <div className="footer-bottom">
                <span className="copyright">© DisStreamChat 2020</span>
                <span className="made-by">Made with ❤ by the <a href="https://github.com/orgs/DisStreamChat/people" target="_blank" rel="noreferrer noopener">distwitchchat team</a></span>
            </div>
        </footer>
    );
}

export default Footer;
