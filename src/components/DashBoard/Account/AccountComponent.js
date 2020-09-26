import React from "react";

const logos = {
    "discord": "https://cdn.iconscout.com/icon/free/png-512/discord-3-569463.png",
    "twitch": "/social-media.svg"
}

const DiscordComponent = ({platform}) => {
	return (
		<div className={`account discord`}>
			<div className={`account-header ${platform}`}>
				<img src={logos[platform]} alt="" />
                <div className="name">
                    <p></p>
                    <p>Account Name</p>
                </div>
			</div>
			<div className={`account-body ${platform}`}></div>
		</div>
	);
};

export default DiscordComponent;
