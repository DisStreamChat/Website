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
import firebase from "../../../../../firebase";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Switch } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { blueGrey } from "@material-ui/core/colors";

const FancySwitch = withStyles({
	root: {
		padding: 7,
	},
	thumb: {
		width: 24,
		height: 24,
		backgroundColor: "#fff",
		boxShadow: "0 0 12px 0 rgba(0,0,0,0.08), 0 0 8px 0 rgba(0,0,0,0.12), 0 0 4px 0 rgba(0,0,0,0.38)",
	},
	switchBase: {
		color: "rgba(0,0,0,0.38)",
		padding: 7,
	},
	track: {
		borderRadius: 20,
		backgroundColor: blueGrey[300],
	},
	checked: {
		"& $thumb": {
			backgroundColor: "#fff",
		},
		"& + $track": {
			opacity: "1 !important",
		},
	},
	focusVisible: {},
})(Switch);

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
	justify-content: space-between;
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

const FlexContainer = styled.span`
	display: flex;
	align-items: center;
`;

const types = {
	ADD_ON_ADD: "Add",
	REMOVE_ON_REMOVE: "Remove",
	ADD_ON_REMOVE: "Add (reversed)",
	REMOVE_ON_ADD: "Remove (reversed)",
	TOGGLE: "Toggle",
};

export const ActionItem = React.memo(({ message, onSubmit, DMuser, role, guild, adding, emoji, type, deleteAble, add, onClick, close }) => {
	const [displayRole, setDisplayRole] = useState();
	const { state, update } = useContext(RoleContext);
	const [action, setAction] = useState({});

	useEffect(() => {
		if (!add && !adding) {
			setDisplayRole(guild.roles.find(r => r.id === role));
		}
	}, [adding, guild, role, add]);

	const submit = () => {
		const roleID = JSON.parse(action.role.value.split("=")[1]).id;
		console.log(roleID);
		const actionObj = {
			role: roleID,
			type: action.type,
			DMuser: action.DMuser,
		};
		if (onSubmit) {
			onSubmit(action.emoji, actionObj);
		} else {
			update(`manager.actions[${action.emoji}]`, actionObj);
		}
		return close?.();
	};

	const deleteMe = async () => {
		if (!deleteAble) return;
		await firebase.db
			.collection("reactions")
			.doc(guild.id)
			.update({ [`${message}.actions.${emoji}`]: firebase.delete() });
	};

	return (
		<ActionBody adding={adding}>
			{deleteAble && (
				<div className="delete-button" onClick={deleteMe}>
					<CancelTwoToneIcon />
				</div>
			)}
			{!add && !adding ? (
				<>
					<FlexContainer>
						<Twemoji options={{ className: "twemoji" }}>
							<span style={{ marginRight: ".5rem", textTransform: "capitalize" }}>
								{emoji?.replace("catch-all", "All").replace("-", " ")}
							</span>
						</Twemoji>
						-{" "}
						{displayRole && (
							<RoleItem style={{ marginLeft: ".5rem" }} {...displayRole}>
								{displayRole.name}
							</RoleItem>
						)}
					</FlexContainer>
					<FlexContainer>
						<h4>Type: {types[type]}</h4>
						<h4 style={{ marginLeft: "2rem", textTransform: "capitalize" }}>DM: {(!!DMuser).toString()}</h4>
					</FlexContainer>
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
					<div style={{ paddingLeft: ".75rem" }}>
						<FormControlLabel
							control={
								<FancySwitch
									color="primary"
									checked={!!action.DMuser}
									onChange={e => {
										setAction(prev => ({ ...prev, DMuser: e.target.checked }));
									}}
									name={"dm_user"}
								/>
							}
							label={"DM"}
						/>
					</div>
					{action.role && action.type && action.emoji && (
						<ActionButton onClick={submit}>
							<CheckIcon />
						</ActionButton>
					)}
					<ActionButton onClick={() => close?.()}>
						<CloseIcon />
					</ActionButton>
				</>
			)}
		</ActionBody>
	);
});

const ManagerItem = React.memo(({ guild, channel, actions, channelOveride, message, join }) => {
	const [displayChannel, setDisplayChannel] = useState();
	const [addingAction, setAddingAction] = useState(false);

	useEffect(() => {
		setDisplayChannel(guild.channels.find(c => c.id === channel));
	}, [channel, guild]);

	const deleteMe = async () => {
		await firebase.db
			.collection("reactions")
			.doc(guild.id)
			.update({ [`${message}`]: firebase.delete() });
	};

	return (
		<ManagerBody>
			<div className="delete-button" onClick={deleteMe}>
				<CancelTwoToneIcon />
			</div>
			<h4>
				{displayChannel?.name || channelOveride} <ChannelParent> {displayChannel?.parent}</ChannelParent>
			</h4>
			{Object.entries(actions || {})
				.sort()
				.map(([key, value]) => (
					<ActionItem deleteAble={!channelOveride} message={message} {...value} emoji={key} guild={guild} />
				))}
			{addingAction && (
				<ActionItem
					onSubmit={async (emoji, action) => {
						await firebase.db
							.collection("reactions")
							.doc(guild.id)
							.update({ [`${message}.actions.${emoji}`]: action });
					}}
					close={() => setAddingAction(false)}
					guild={guild}
					adding
					deleteAble={false}
				/>
			)}
			{!join && (
				<ActionItem
					onClick={() => {
						setAddingAction(true);
					}}
					deleteAble={false}
					add
				></ActionItem>
			)}
		</ManagerBody>
	);
});

export default ManagerItem;
