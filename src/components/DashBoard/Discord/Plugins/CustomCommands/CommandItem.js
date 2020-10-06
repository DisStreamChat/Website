import React, { useCallback, useContext } from "react";
import "./CommandItem.scss";
import firebase from "../../../../../firebase";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import { DiscordContext } from "../../../../../contexts/DiscordContext";
import { CommandContext } from "../../../../../contexts/CommandContext";

const CommandItem = ({ name, message, description, type, setCommands, bannedRoles, allowedRoles, allowedChannels, cooldown, deleteUsage }) => {
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

	const edit = useCallback(async () => {
		setName(name);
		setResponse(message);
		setRoleToGive();
		setDescription(description);
		setAllowedRoles(allowedRoles || []);
		setAllowedChannels(allowedChannels || []);
		setBannedRoles(bannedRoles || []);
		setCooldown(cooldown || 0);
		setDeleteUsage(deleteUsage);
		setError({});
	});

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
				<button>Edit</button>
			</div>
		</div>
	);
};

export default CommandItem;
