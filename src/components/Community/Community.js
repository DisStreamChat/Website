import React from "react";
import "./Community.scss";
import A from "../Shared/A"

const Community = () => {
	return (
		<>
			<div className="header-area">
				<h1 className="body-header">Join The Community!</h1>
				<h3 className="body-subheader">Come Say Hi in the discord!</h3>
			</div>
			<div className="community buttons">
				<A href="https://api.disstreamchat.com/discord" newTab className="discord-button">
					<img src={`${process.env.PUBLIC_URL}/discord.png`} alt="custom discord logo"></img>
					Join The Discord
				</A>
			</div>
		</>
	);
};

export default Community;
