import { useCallback, useContext, useEffect, useState } from "react";
import "./CommandItem.scss";
import firebase from "../../../../../firebase";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import { CommandContext } from "../../../../../contexts/CommandContext";
import RoleItem from "../../../../Shared/RoleItem";

const CommandItem = ({
	name,
	message,
	type,
	description,
	setCommands,
	bannedRoles,
	permittedRoles,
	allowedChannels,
	cooldown,
	deleteUsage,
	setCreatingCommand,
	role,
	guild: userConnectedGuildInfo,
}) => {
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
	const [displayRole, setDisplayRole] = useState();
	const [allowedRoles, setPermittedRoles] = useState([]);
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

	useEffect(() => {
		setPermittedRoles(
			permittedRoles.map(id => {
				const role = userConnectedGuildInfo?.roles?.find?.(r => r.id === id);
				return {
					value: `${role.name}=${JSON.stringify(role)}`,
					label: <RoleItem {...role}>{role.name}</RoleItem>,
				};
			})
		);
	}, [permittedRoles, userConnectedGuildInfo]);

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
		// console.log({ allowedRoles });
		setAllowedRoles(allowedRoles || []);
		setAllowedChannels(
			(allowedChannels || []).map(id => {
				const channel = userConnectedGuildInfo.channels.find(r => r.id === id);
				return {
					value: `${channel.name}=${JSON.stringify(channel)}`,
					label: (
						<>
							<span>{channel.name}</span>
							<span className="channel-category">{channel.parent}</span>
						</>
					),
				};
			})
		);
		setBannedRoles(
			(bannedRoles || []).map(id => {
				const role = userConnectedGuildInfo?.roles?.find?.(r => r.id === id);
				return {
					value: `${role.name}=${JSON.stringify(role)}`,
					label: <RoleItem {...role}>{role.name}</RoleItem>,
				};
			})
		);
		setCooldown(cooldown || 0);
		setDeleteUsage(deleteUsage);
		setError({});
		setEditing(true);
		setCreatingCommand(type || "text");
	};

	useEffect(() => {
		setDisplayRole(userConnectedGuildInfo.roles.find(r => r.id === role));
	}, [role, setDisplayRole, userConnectedGuildInfo.roles]);

	return (
		<div className="command-item">
			<div className="delete-button" onClick={deleteMe}>
				<CancelTwoToneIcon />
			</div>
			<span style={{ display: "flex" }}>
				<div className="display-image">
					<img alt="" width="50px" src={type === "role" ? "/role.svg" : "/speech.svg"} />
				</div>
				<div className="command-item--info">
					<h3>{name}</h3>
					<h4>{description}</h4>
				</div>
			</span>
			<div className="command-item--options">
				{type === "role" && displayRole && (
					<div className="command-role">
						<RoleItem {...displayRole}>{displayRole.name}</RoleItem>
					</div>
				)}
				<button onClick={edit}>Edit</button>
			</div>
		</div>
	);
};

export default CommandItem;
