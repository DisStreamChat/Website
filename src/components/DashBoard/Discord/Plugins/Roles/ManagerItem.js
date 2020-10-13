import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import RoleItem from "../../../../Shared/RoleItem";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import Twemoji from "react-twemoji";
import AddCircleTwoToneIcon from "@material-ui/icons/AddCircleTwoTone";
import { RoleContext } from "../../../../../contexts/RoleContext";
import { Picker } from "emoji-mart";
import 'emoji-mart/css/emoji-mart.css'

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
    border-radius: 0.25rem;
    z-index: ${props => props.adding ? 10 : 1};
	h3,
	h2,
	h4,
	h1,
	p {
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

export const ActionItem = React.memo(({ index, role, guild, adding, emoji, type, deleteAble, add, onClick }) => {
	const [displayRole, setDisplayRole] = useState();
	const { state, update } = useContext(RoleContext);

	useEffect(() => {
		if (!add && !adding) {
			setDisplayRole(guild.roles.find(r => r.id === role));
		}
	}, [adding, guild, role, add]);

	return (
		<ActionBody adding={adding}>
			{deleteAble && (
				<div className="delete-button">
					<CancelTwoToneIcon />
				</div>
			)}
			{!add && !adding ? (
				<>
					<Twemoji options={{ className: "twemoji" }}>
						<span style={{ marginRight: ".5rem", textTransform: "capitalize" }}>
							{emoji?.replace("catch-all", "All").replace("-", " ")}
						</span>
					</Twemoji>
					- {displayRole && <RoleItem {...displayRole}>{displayRole.name}</RoleItem>}
					<h4>Type: {types[type]}</h4>
				</>
			) : !adding ? (
				<span onClick={() => onClick?.()} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
					<AddCircleTwoToneIcon />
					<h4 style={{ marginLeft: ".5rem" }}>Add Action</h4>
				</span>
			) : (
				<>
					<Picker theme="dark" style={{position: "absolute", top: 0, zIndex: 100}} set="twitter" title="Pick your emoji…" emoji="point_up" />-{" "}
					{displayRole && <RoleItem {...displayRole}>{displayRole.name}</RoleItem>}
					<h4>Type: <input type="text"/></h4>
				</>
			)}
		</ActionBody>
	);
});

const ManagerItem = React.memo(({ guild, channel, actions, channelOveride }) => {
	const [displayChannel, setDisplayChannel] = useState();

	useEffect(() => {
		setDisplayChannel(guild.channels.find(c => c.id === channel));
	}, [channel, guild]);

	return (
		<ManagerBody>
			<div className="delete-button">
				<CancelTwoToneIcon />
			</div>
			<h4>
				{displayChannel?.name || channelOveride} <ChannelParent> {displayChannel?.parent}</ChannelParent>
			</h4>
			{Object.entries(actions || {}).map(([key, value]) => (
				<ActionItem deleteAble={!channelOveride} {...value} emoji={key} guild={guild} />
			))}
			<ActionItem deleteAble={false} add></ActionItem>
		</ManagerBody>
	);
});

export default ManagerItem;
