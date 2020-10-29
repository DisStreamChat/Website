import React, { useEffect, useContext } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import RoleItem from "../../../../Shared/RoleItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { CommandContext } from "../../../../../contexts/CommandContext";
import firebase from "../../../../../firebase";
import StyledSelect from "../../../../../styled-components/StyledSelect";
import FancySwitch from "../../../../../styled-components/FancySwitch"

const CreateCommand = ({ setCreatingCommand, children, role, guild: userConnectedGuildInfo }) => {
	const {
		editing,
		setEditing,
		name,
		setName,
		response,
		roleToGive,
		description,
		setDescription,
		allowedRoles,
		setAllowedRoles,
		bannedRoles,
		setBannedRoles,
		allowedChannels,
		setAllowedChannels,
		cooldown,
		setCooldown,
		deleteUsage,
		setDeleteUsage,
		error,
		setError,
	} = useContext(CommandContext);

	useEffect(() => {
		if (!editing) {
			setAllowedRoles(
				userConnectedGuildInfo?.roles
					?.filter(role => role.name === "@everyone")
					?.map(role => ({
						value: `${role.name}=${JSON.stringify(role)}`,
						label: <RoleItem {...role}>{role.name}</RoleItem>,
					}))
			);
		}
	}, [editing, userConnectedGuildInfo?.roles, setAllowedRoles]);

	return (
		<>
			<div className="command-header">
				<h1>Create {role ? "Role" : "Text"} Command</h1>
				<button onClick={() => setCreatingCommand(false)}>
					<ClearIcon />
				</button>
			</div>
			<div className="command-body">
				<h4 className="plugin-section-title">Command Name</h4>
				<div className="plugin-section">
					<input
						disabled={editing}
						value={name}
						onChange={e => setName(e.target.value.replace(/\s/, "-"))}
						placeholder="Command Name (Don't include prefix)"
						type="text"
						className="prefix-input"
						id="command-name"
					/>
				</div>
				{children}
				<h4 className="plugin-section-title">Command Description</h4>
				<div className="plugin-section">
					<input
						placeholder="A very cool command"
						value={description}
						onChange={e => setDescription(e.target.value)}
						type="text"
						className="prefix-input"
						id="command-description"
					/>
				</div>
				<h4 className="plugin-section-title">Allowed Roles</h4>
				<div className="plugin-section">
					<StyledSelect
						closeMenuOnSelect={false}
						isMulti
						onChange={e => {
							setAllowedRoles(e);
						}}
						placeholder="Select Allowed Roles"
						value={allowedRoles}
						options={userConnectedGuildInfo?.roles
							?.sort((a, b) => b.rawPosition - a.rawPosition)
							?.map(role => ({
								value: `${role.name}=${JSON.stringify(role)}`,
								label: <RoleItem {...role}>{role.name}</RoleItem>,
							}))}
					/>
				</div>
				<h4 className="plugin-section-title">Banned Roles</h4>
				<div className="plugin-section">
					<StyledSelect
						closeMenuOnSelect={false}
						isMulti
						onChange={e => {
							setBannedRoles(e);
						}}
						placeholder="Select Banned Roles"
						value={bannedRoles}
						options={userConnectedGuildInfo?.roles
							?.filter(role => role.name !== "@everyone")
							?.sort((a, b) => b.rawPosition - a.rawPosition)
							?.map(role => ({
								value: `${role.name}=${JSON.stringify(role)}`,
								label: <RoleItem {...role}>{role.name}</RoleItem>,
							}))}
					/>
				</div>
				<h4 className="plugin-section-title">Allowed Channels</h4>
				<div className="plugin-section">
					<StyledSelect
						closeMenuOnSelect={false}
						isMulti
						onChange={e => {
							setAllowedChannels(e);
						}}
						placeholder="Select Allowed Channels"
						value={allowedChannels}
						options={userConnectedGuildInfo?.channels
							?.sort((a, b) => a.parent.localeCompare(b.parent))
							?.map(channel => ({
								value: `${channel.name}=${JSON.stringify(channel)}`,
								label: (
									<>
										<span>{channel.name}</span>
										<span className="channel-category">{channel.parent}</span>
									</>
								),
							}))}
					/>
				</div>
				<h4 className="plugin-section-title">Command Cooldown (in minutes)</h4>
				<div className="plugin-section">
					<input
						placeholder="Cooldown"
						value={cooldown}
						min={0}
						onBlur={e => setCooldown(Math.max(+e.target.value, 0))}
						onChange={e => setCooldown(e.target.value)}
						type="number"
						className="prefix-input"
						id="command-cooldown"
					/>
				</div>
				{role && (
					<>
						<h4 className="plugin-section-title">Delete After use</h4>
						<div className="plugin-section" style={{ paddingLeft: ".75rem" }}>
							<FormControlLabel
								control={
									<FancySwitch
										color="primary"
										checked={!!deleteUsage}
										onChange={e => {
											setDeleteUsage(e.target.checked);
										}}
										name={"Delete_after_usage"}
									/>
								}
								label={"Delete After Usage"}
							/>
						</div>
					</>
				)}
			</div>
			<div className={`command-footer ${error.message ? "error" : ""}`}>
				{error.message && <span className="error-message">{error.message}</span>}
				<button
					onClick={async () => {
						setError({});
						if (name.length === 0) return setError({ message: "The Command must have name" });
						if (!role && response.length === 0) return setError({ message: "The Command must have a response" });
						const commandRef = firebase.db.collection("customCommands").doc(userConnectedGuildInfo.id);
						if (!editing) {
							const commands = (await commandRef.get()).data();
							if (commands?.[name]) return setError({ message: "A Command with that name already exists" });
						}
						const parsedAllowedRoles = parseSelectValue(allowedRoles);
						const parsedBannedRoles = parseSelectValue(bannedRoles);
						const parsedAllowedChannels = parseSelectValue(allowedChannels);
						const parsedRoleToGive = parseSelectValue(roleToGive);
						const commandObj = {
							name,
							message: response || false,
							deleteUsage: deleteUsage || false,
							role: parsedRoleToGive || false,
							type: role ? "role" : "text",
							bannedRoles: parsedBannedRoles,
							permittedRoles: parsedAllowedRoles,
							allowedChannels: parsedAllowedChannels,
							cooldownTime: cooldown * 60000,
							cooldown,
							DM: false,
							description,
						};
						try {
							await commandRef.update({ [name]: commandObj });
						} catch (err) {
							await commandRef.set({ [name]: commandObj });
						}
						setEditing(false);
						setName("");
						setDescription("");
						setAllowedRoles([]);
						setBannedRoles([]);
						setAllowedChannels([]);
						setCooldown(0);
						setDeleteUsage(false);
						setError({});

						setCreatingCommand(false);
					}}
				>
					{editing ? "Update" : "Create"}
				</button>
			</div>
		</>
	);
};

export default CreateCommand;
