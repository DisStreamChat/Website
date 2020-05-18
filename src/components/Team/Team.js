import React from 'react';

import "./Team.css"
import GitHubIcon from '@material-ui/icons/GitHub';
import TwitterIcon from '@material-ui/icons/Twitter';
import A from "../Shared/A"

const Team = () => {
    return (
        <main className="main team-page">
            <h1 className="team-header">DisTwitchChat's Team</h1>
            <div className="members">
                <A href="https://github.com/GypsyDangerous" newTab><img className="team-picture" src={`${process.env.PUBLIC_URL}/david.png`} width="320" alt="" /></A>
                <A href="https://saintplaysthings.com" newTab><img className="team-picture" src={`${process.env.PUBLIC_URL}/kobe.png`} width="320" alt="" /></A>
                <h1 className="team-title">David</h1>
                <h1 className="team-title">Kobe</h1>
                <h3 className="team-sub-title">Project Lead</h3>
                <h3 className="team-sub-title">Software Engineer</h3>
                <div className="socials">
                    <A href="https://github.com/GypsyDangerous" newTab><GitHubIcon/></A>
                    <A href="https://twitter.com/Snyderling_" newTab><TwitterIcon/></A>
                </div>
                <div className="socials">
                    <A href="https://github.com/KobeLiesenborgs" newTab><GitHubIcon/></A>
                    <A href="https://www.twitch.tv/saintplaysthings/" newTab><img src={`${process.env.PUBLIC_URL}/social-media.svg`} alt="" width="24"></img></A>
                </div>
            </div>
        </main>
    );
}

export default Team;
