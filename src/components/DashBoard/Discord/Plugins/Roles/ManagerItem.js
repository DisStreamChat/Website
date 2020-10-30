import { memo, useState, useEffect } from "react";
import styled from "styled-components";
import RoleItem from "../../../../../styled-components/RoleItem";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import Twemoji from "react-twemoji";
import AddCircleTwoToneIcon from "@material-ui/icons/AddCircleTwoTone";
import "emoji-mart/css/emoji-mart.css";
import firebase from "../../../../../firebase";
import {  useMediaQuery } from "@material-ui/core";
import {REACTION_ROLE_ACTION_TYPES} from "../../../../../utils/constants"


const ChannelParent = styled.span`
	color: #aaa;
	font-size: 14px;
	margin-left: 0.25rem;
`;

const ManagerBody = styled.div`
	margin: 1rem 0;
	display: flex;
	position: relative;
	padding: 0.5rem 1rem;
	border: 1px solid black;
	background: #1f1f1f;
    flex-direction: column;
`;

const ActionBody = styled.div`
	width: 100% !important;
	box-sizing: border-box !important;
	display: flex;
	padding: 1rem;
	justify-content: space-between;
	margin: 0.25rem;
	margin-left: 0rem;
	background: #1a1a1a;
	position: relative;
	align-items: center;
	border-radius: 0.25rem;
	z-index: ${props => (props.adding ? 10 : 0)};
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

const FlexContainer = styled.span`
	display: flex;
	align-items: center;
`;

export const ActionItem = memo(({ message, onSubmit, DMuser, role, guild, adding, emoji, type, deleteAble, add, onClick, close }) => {
	const [displayRole, setDisplayRole] = useState();
	
	useEffect(() => {
		if (!add && !adding) {
			if (!Array.isArray(role)) {
				setDisplayRole([guild.roles.find(r => r.id === role)]);
			} else {
				setDisplayRole(role.map(id => guild.roles.find(r => r.id === id)));
			}
		}
	}, [adding, guild, role, add]);

	const deleteMe = async () => {
		if (!deleteAble) return;
		await firebase.db
			.collection("reactions")
			.doc(guild.id)
			.update({ [`${message}.actions.${emoji}`]: firebase.delete() });
	};

	const smallScreen = useMediaQuery("(max-width: 500px)");

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
						{displayRole &&
							displayRole.map(role => (
								<RoleItem style={{ marginLeft: ".5rem" }} {...role}>
									{role.name}
								</RoleItem>
							))}
					</FlexContainer>
					{!smallScreen && (
						<FlexContainer>
							<h4>Type: {REACTION_ROLE_ACTION_TYPES[type]}</h4>
							<h4 style={{ marginLeft: "2rem", textTransform: "capitalize" }}>DM: {(!!DMuser).toString()}</h4>
						</FlexContainer>
					)}
				</>
			) : !adding ? (
				<span onClick={() => onClick?.()} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
					<AddCircleTwoToneIcon />
					<h4 style={{ marginLeft: ".5rem" }}>Add Action</h4>
				</span>
			) : (
				<></>
			)}
		</ActionBody>
	);
});

const ManagerItem = memo(({ guild, channel, actions, channelOveride, message, join }) => {
	const [displayChannel, setDisplayChannel] = useState();
	const [addingAction, setAddingAction] = useState(false);

	console.log(message);

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
							.update({ [`${message}.actions.${emoji}`]: { ...action, DMuser: !!action.DMuser } });
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
