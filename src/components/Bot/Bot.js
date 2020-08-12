import React from "react";
import "./Bot.scss";
import A from "../Shared/A";

const Bot = () => {
	return (
		<div className="landing">
			<section className="feature">
				<div className="left">
					<h1>Use our discord bot to handle moderation, leveling users up and so much more.</h1>
					<h3>
						<A href="https://api.disstreamchat.com/invite" newTab>
							Invite
						</A>{" "}
						our bot over here to unlock your server's full potential and allow people to level up, moderate the chat, get info about users
						and so much more. Disclaimer: The discord bot is a WIP and not every feature is publicly released yet
					</h3>
				</div>
				<div className="right two-images">
                    <img className="on-top" src="https://cdn.discordapp.com/attachments/689169277781016629/743149311491178567/unknown.png" alt=""/>
					<img src="https://cdn.discordapp.com/attachments/689169277781016629/743149131102421122/unknown.png" alt="" />
				</div>
			</section>
		</div>
	);
};

export default Bot;
