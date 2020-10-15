import React from "react";
import styled from "styled-components"

const logos = {
    "discord": "https://cdn.iconscout.com/icon/free/png-512/discord-3-569463.png",
    "twitch": "/social-media.svg"
}

const AccountName = styled.p`
	text-transform: capitalize;
`


const DiscordComponent = ({profilePicture, platform, name}) => {
	return (
		<div className={`account discord`}>
			<div className={`account-header ${platform}`}>
				<img src={logos[platform]} alt="" />
				<img src={profilePicture} alt=""/>
                <div className="name">
                    <AccountName>{name}</AccountName>
					<p>Account Name</p>
                </div>
			</div>
			<div className={`account-body ${platform}`}></div>
		</div>
	);
};

export default DiscordComponent;
