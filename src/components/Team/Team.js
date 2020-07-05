import React from "react";

import "./Team.scss";
import GitHubIcon from "@material-ui/icons/GitHub";
import TwitterIcon from "@material-ui/icons/Twitter";
import Member from "./Member";

const Team = () => {
	return (
		<main className="main team-page">
			<h1 className="team-header">DisStreamChat's Team</h1>
			<div className="members">
				<Member
					imgUrl="https://github.com/GypsyDangerous"
					img={`${process.env.PUBLIC_URL}/david.png`}
					name="David"
					title="Founder"
					socials={[
						{ link: "https://github.com/GypsyDangerous", icon: <GitHubIcon /> },
						{ link: "https://twitter.com/Snyderling_", icon: <TwitterIcon /> },
					]}
				></Member>
				<Member
					imgUrl="https://saintplaysthings.com"
					img={`${process.env.PUBLIC_URL}/kobe.png`}
					name="Kobe"
					title="Co-Founder"
					socials={[
						{ link: "https://github.com/KobeLiesenborgs", icon: <GitHubIcon /> },
						{
							link: "https://www.twitch.tv/saintplaysthings/",
							icon: <img src={`${process.env.PUBLIC_URL}/social-media.svg`} alt="" width="24"></img>,
						},
					]}
				></Member>
				<Member
					imgUrl="https://turnergames.net"
					img={`https://static-cdn.jtvnw.net/jtv_user_pictures/murdocturner-profile_image-c5e3ba3322f8e24a-300x300.png`}
					name="Murdoc"
					title="Twitch/Discord bot expert"
					socials={[
						{ link: "https://github.com/murdocturner", icon: <GitHubIcon /> },
						{
							link: "https://twitch.tv/murdocturner",
							icon: <img src={`${process.env.PUBLIC_URL}/social-media.svg`} alt="" width="24"></img>,
						},
						{
							link: "https://twitter.com/jamesrturner88",
							icon: <TwitterIcon />,
                        },
                        {
                            link: "https://discord.turnergames.net",
                            icon: <img src="https://cdn.iconscout.com/icon/free/png-512/discord-3-569463.png" alt="" width="24"/>
                        }
					]}
				></Member>
			</div>
		</main>
	);
};

export default Team;
