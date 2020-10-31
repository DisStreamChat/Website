import { memo, useState, useEffect } from "react";
import RoleItem from "../../../../../styled-components/RoleItem";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import Twemoji from "react-twemoji";
import "emoji-mart/css/emoji-mart.css";
import firebase from "../../../../../firebase";
import { styled, useMediaQuery } from "@material-ui/core";
import { REACTION_ROLE_ACTION_TYPES } from "../../../../../utils/constants";
import { ActionBody } from "../../../../../styled-components/ReactionRoleComponents";
import FlexContainer from "../../../../../styled-components/BaseComponents/FlexContainer";

const ActionItem = memo(({ message, DMuser, role, guild, emoji, type, deleteAble }) => {
	const [displayRole, setDisplayRole] = useState();

	useEffect(() => {
		if (!Array.isArray(role)) {
			setDisplayRole([guild.roles.find(r => r.id === role)]);
		} else {
			setDisplayRole(role.map(id => guild.roles.find(r => r.id === id)));
		}
	}, [guild, role]);

	const deleteMe = async () => {
		if (!deleteAble) return;
		await firebase.db
			.collection("reactions")
			.doc(guild.id)
			.update({ [`${message}.actions.${emoji}`]: firebase.delete() });
	};

	const smallScreen = useMediaQuery("(max-width: 500px)");

	return (
		<ActionBody style={{ display: "flex" }}>
			{deleteAble && (
				<div className="delete-button" onClick={deleteMe}>
					<CancelTwoToneIcon />
				</div>
			)}
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
					<h4 style={{ marginLeft: "2rem", textTransform: "capitalize" }}>
						DM: {(!!DMuser).toString()}
					</h4>
				</FlexContainer>
			)}
		</ActionBody>
	);
});

export default ActionItem;
