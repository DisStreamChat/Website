import React from "react";
import "./Bot.scss";
import A from "../Shared/A";
import Feature from "../Shared/Feature";

const Bot = () => {
	return (
		<div className="landing">
			<Feature
				title="Use our discord bot to handle moderation, leveling users up and so much more."
				body={
					<>
						<A className="invite" href="https://api.disstreamchat.com/invite" newTab>
							Invite
						</A>{" "}
						our bot to unlock your server's full potential and allow people to level up, moderate the chat, get info about users and so
						much more. Disclaimer: The discord bot is a WIP and not every feature is publicly released yet.
					</>
				}
                images={[`${process.env.PUBLIC_URL}/invite.png`, `${process.env.PUBLIC_URL}/rank.png`]}
                imageClassNames={["on-top nudge-up see-through"]}
			></Feature>
		</div>
	);
};

export default Bot;
