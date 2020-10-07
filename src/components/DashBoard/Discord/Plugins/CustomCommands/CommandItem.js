import React, { useCallback, useContext, useEffect, useState } from "react";
import "./CommandItem.scss";
import firebase from "../../../../../firebase";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import { DiscordContext } from "../../../../../contexts/DiscordContext";
import { CommandContext } from "../../../../../contexts/CommandContext";
import RoleItem from "../../../../Shared/RoleItem";

const CommandItem = ({
	name,
	message,
	type,
	description,
	setCommands,
	bannedRoles,
	allowedRoles,
	allowedChannels,
	cooldown,
	deleteUsage,
	setCreatingCommand,
	role,
}) => {
	const { userConnectedGuildInfo } = useContext(DiscordContext);
	const {
		setName,
		setResponse,
		setRoleToGive,
		setDescription,
		setAllowedRoles,
		setBannedRoles,
		setAllowedChannels,
		setCooldown,
		setDeleteUsage,
		setError,
		setEditing,
	} = useContext(CommandContext);
	const guildId = userConnectedGuildInfo.id;
	const deleteMe = useCallback(async () => {
		setCommands(prev => {
			const copy = { ...prev };
			delete copy[name];
			return copy;
		});
		const commandRef = await firebase.db.collection("customCommands").doc(guildId);
		commandRef.update({
			[name]: firebase.app.firestore.FieldValue.delete(),
		});
	}, [guildId, name, setCommands]);

	const edit = async () => {
		setName(name);
		setResponse(message);
		if (type === "role") {
			const roleToGive = userConnectedGuildInfo.roles.find(r => r.id === role);
			setRoleToGive({
				value: `${roleToGive.name}=${JSON.stringify(roleToGive)}`,
				label: <RoleItem {...roleToGive}>{roleToGive.name}</RoleItem>,
			});
		}
		setDescription(description);
		setAllowedRoles(allowedRoles || []);
		setAllowedChannels(allowedChannels || []);
		setBannedRoles(bannedRoles || []);
		setCooldown(cooldown || 0);
		setDeleteUsage(deleteUsage);
		setError({});
		setEditing(true);
		setCreatingCommand(type || "text");
	};
	
	const [displayRole, setDisplayRole] = useState()
	useEffect(() => {
		setDisplayRole(userConnectedGuildInfo.roles.find(r => r.id === role))
	}, [])

	console.log(displayRole)
	
	return (
		<div className="command-item">
			<div className="delete-button" onClick={deleteMe}>
				<CancelTwoToneIcon />
			</div>
			<div className="command-item--info">
				<h3>{name}</h3>
				<h4>{description}</h4>
			</div>
			<div className="command-item--options">
				{type === "role" && displayRole && <div className="command-role"><RoleItem {...displayRole}>{displayRole.name}</RoleItem></div>}
				<button onClick={edit}>Edit</button>
			</div>
		</div>
	);
};

export default CommandItem;
