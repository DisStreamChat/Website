import React from 'react';

import "./Team.css"
import GitHubIcon from '@material-ui/icons/GitHub';
import TwitterIcon from '@material-ui/icons/Twitter';
import Member from './Member';

const Team = () => {
    return (
        <main className="main team-page">
            <h1 className="team-header">DisTwitchChat's Team</h1>
            <div className="members">
                <Member
                    imgUrl="https://github.com/GypsyDangerous"
                    img={`${process.env.PUBLIC_URL}/david.png`}
                    name="David"
                    title="Founder"
                    socials={[
                        {link: "https://github.com/GypsyDangerous", icon: <GitHubIcon />},
                        { link: "https://twitter.com/Snyderling_", icon: <TwitterIcon />}
                        
                    ]}
                ></Member>
                <Member
                    imgUrl="https://saintplaysthings.com"
                    img={`${process.env.PUBLIC_URL}/kobe.png`}
                    name="Kobe"
                    title="Co-Founder"
                    socials={[
                        { link: "https://github.com/KobeLiesenborgs", icon: <GitHubIcon /> },
                        { link: "https://www.twitch.tv/saintplaysthings/", icon: <img src={`${process.env.PUBLIC_URL}/social-media.svg`} alt="" width="24"></img> }
                    ]}
                ></Member>
                
            </div>
        </main>
    );
}

export default Team;
