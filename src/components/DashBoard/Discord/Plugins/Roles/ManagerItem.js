import React, { useState, useEffect } from "react";
import styled from "styled-components";
import RoleItem from "../../../../Shared/RoleItem";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";

const ChannelParent = styled.span`
	color: #aaa;
	font-size: 14px;
	margin-left: 0.25rem;
`;

const ManagerBody = styled.div`
	margin: 1rem 0;
	display: flex;
	// align-items: center;
	// justify-content: space-between;
	position: relative;
	padding: 0.5rem 1rem;
	border: 1px solid black;
	background: #1f1f1f;
	flex-direction: column;
`;

const ActionBody = styled.div`
	display: flex;
	padding: 0.5rem 0.5rem;
	margin: 0.25rem;
	margin-left: 0.75rem;
	background: #1a1a1a;
	position: relative;
	align-items: center;
	h3, h2, h4, h1, p {
		margin: 0;
	}
	& > div:not(:first-child) {
		margin-left: 0.5rem;
		margin-right: 0.5rem;
	}
`;

const types = {
	ADD_ON_ADD: "Add",
	REMOVE_ON_REMOVE: "Remove",
	ADD_ON_REMOVE: "Add (reversed)",
	REMOVE_ON_ADD: "Remove (reversed)",
	TOGGLE: "Toggle",
};

const ActionItem = ({ role, guild, emoji, type }) => {
	const [displayRole, setDisplayRole] = useState();

	useEffect(() => {
		setDisplayRole(guild.roles.find(r => r.id === role));
	}, [guild, role]);

	console.log(displayRole);

	return (
		<ActionBody>
			<div className="delete-button">
				<CancelTwoToneIcon />
			</div>
			<span style={{ marginRight: ".5rem" }}>{emoji?.replace("catch-all", "*")}</span> -{" "}
			{displayRole && <RoleItem {...displayRole}>{displayRole.name}</RoleItem>}
			<h3>Type: {types[type]}</h3>
		</ActionBody>
	);
};

const ManagerItem = ({ guild, channel, actions }) => {
	const [displayChannel, setDisplayChannel] = useState();

	useEffect(() => {
		setDisplayChannel(guild.channels.find(c => c.id === channel));
	}, [channel, guild]);

	return (
		<ManagerBody>
			<h4>
				{displayChannel?.name} <ChannelParent> {displayChannel?.parent}</ChannelParent>
			</h4>
			{Object.entries(actions || {}).map(([key, value]) => (
				<ActionItem {...value} emoji={key} guild={guild} />
			))}
		</ManagerBody>
	);
};

export default ManagerItem;
