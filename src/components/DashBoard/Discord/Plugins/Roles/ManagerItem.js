import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import RoleItem from "../../../../Shared/RoleItem";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import Twemoji from "react-twemoji";
import AddCircleTwoToneIcon from "@material-ui/icons/AddCircleTwoTone";
import { RoleContext } from "../../../../../contexts/RoleContext";
import { Picker } from "emoji-mart";
import "emoji-mart/css/emoji-mart.css";
import Select from "react-select";
import { colorStyles } from "../../../../Shared/userUtils";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";

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
	padding: 1rem;
	margin: 0.25rem;
	margin-left: 0.75rem;
	background: #1a1a1a;
	position: relative;
	align-items: center;
	border-radius: 0.25rem;
	z-index: ${props => (props.adding ? 10 : 1)};
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

const ActionButton = styled.div`
	cursor: pointer;
`;

const types = {
	ADD_ON_ADD: "Add",
	REMOVE_ON_REMOVE: "Remove",
	ADD_ON_REMOVE: "Add (reversed)",
	REMOVE_ON_ADD: "Remove (reversed)",
	TOGGLE: "Toggle",
};

export const ActionItem = React.memo(({ index, role, guild, adding, emoji, type, deleteAble, add, onClick, close }) => {
	const [displayRole, setDisplayRole] = useState();
	const { state, update } = useContext(RoleContext);
	const [action, setAction] = useState({});

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
					{action.emoji ? (
						<span style={{ marginRight: ".5rem", textTransform: "capitalize" }}>
							<Twemoji options={{ className: "twemoji" }}>{action.emoji}</Twemoji>
						</span>
					) : (
						<Picker
							theme="dark"
							style={{ position: "absolute", top: ".25rem", zIndex: 100 }}
							set="twitter"
							title="Pick your emoji…"
							emoji="point_up"
							onSelect={emoji => setAction(prev => ({ ...action, emoji: emoji.native }))}
						/>
					)}
					Role:{" "}
					<div style={{ marginLeft: ".5rem", width: "50%" }}>
						<Select
							onChange={e => {
								setAction(prev => ({ ...prev, role: e }));
							}}
							placeholder="Select Reaction Role"
							value={action.role || ""}
							options={guild?.roles
								?.filter(role => role.name !== "@everyone" && !role.managed)
								?.sort((a, b) => b.rawPosition - a.rawPosition)
								?.map(role => ({
									value: `${role.name}=${JSON.stringify(role)}`,
									label: <RoleItem {...role}>{role.name}</RoleItem>,
								}))}
							styles={{
								...colorStyles,
								container: styles => ({
									...styles,
									...colorStyles.container,
								}),
							}}
						/>
					</div>
					Type:{" "}
					<div style={{ marginLeft: ".5rem", width: "50%" }}>
						<Select
							// closeMenuOnSelect={false}
							onChange={e => {
								setAction(prev => ({ ...prev, type: e.value }));
							}}
							placeholder="Select Action Type"
							value={action?.type ? { value: action?.type, label: types[action?.type] } : ""}
							options={Object.entries(types || {})?.map(([key, value]) => ({
								value: key,
								label: value,
							}))}
							styles={{
								...colorStyles,
								container: styles => ({
									...styles,
									...colorStyles.container,
								}),
							}}
						/>
					</div>
					<ActionButton>
						<CheckIcon />
					</ActionButton>
					<ActionButton onClick={() => close?.()}>
						<CloseIcon />
					</ActionButton>
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
