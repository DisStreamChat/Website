import React from 'react';

import "./Footer.css"
import TwitterIcon from '@material-ui/icons/Twitter';
import GitHubIcon from '@material-ui/icons/GitHub';
import {Link} from "react-router-dom"
import FavoriteIcon from '@material-ui/icons/Favorite';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-top">
                <section className="left">
                    <h3>The best Twitch/Discord Integration</h3>
                    <h4>DisTwitchChat is the easiest way to link your Discord with Twitch chat</h4>
                    <GitHubIcon/>
                    <TwitterIcon/>
                </section>
                <section className="right">
                    <div className="column">
                        <span className="column-header">Product</span>
                        <a href={`https://discord.com/api/oauth2/authorize?client_id=702929032601403482&permissions=0&scope=bot`} target="_blank" rel="noreferrer noopener">Add To Discord</a>
                        <Link to="/apps">Check out the Apps</Link>
                    </div>
                    <div className="column">
                        <span className="column-header">Resources</span>
                        <a href="https://discord.gg/V68x5B" target="_blank" rel="noreferrer noopener">Join The Discord</a>
                        <a href="https://github.com/DisTwitchChat" target="_blank" rel="noreferrer noopener">Get Help on GitHub</a>
                    </div>
                    <div className="column">
                        <span className="column-header">Team</span>
                        <Link to="/members">Members</Link>
                    </div>
                </section>
            </div>
            <div className="footer-bottom">
                <span className="copyright">© DisTwitchChat 2020</span>
                <span className="made-by">Made with ❤ by the <a href="https://github.com/orgs/DisTwitchChat/people" target="_blank" rel="noreferrer noopener">distwitchchat team</a></span>

            </div>
        </footer>
    );
}

export default Footer;
