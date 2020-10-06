import ClearIcon from "@material-ui/icons/Clear";
import { DiscordContext } from "../../../../../contexts/DiscordContext";
import React, { useEffect, useState, useCallback, useContext } from "react";
import Select from "react-select";
import { colorStyles } from "../../../../Shared/userUtils";
import RoleItem from "../../../../Shared/RoleItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Switch } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { blueGrey } from "@material-ui/core/colors";
import { CommandContext } from "../../../../../contexts/CommandContext";
import firebase from "../../../../../firebase";

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

const parseSelectValue = value => {
	if (value instanceof Array) {
		if (value.length === 0) return value;
		return value.map(role => JSON.parse(role.value.split("=")[1])).map(val => val.id);
	} else {
		return JSON.parse(value.value.split("=")[1]).id;
	}
};

const CreateCommand = ({ setCreatingCommand, children, role }) => {
    const { userConnectedGuildInfo } = useContext(DiscordContext);
	const {
		name,
		setName,
		response,
		setResponse,
		roleToGive,
		setRoleToGive,
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
		setAllowedRoles(
			userConnectedGuildInfo?.roles
				?.filter(role => role.name === "@everyone")
				?.map(role => ({
					value: `${role.name}=${JSON.stringify(role)}`,
					label: <RoleItem {...role}>{role.name}</RoleItem>,
				}))
		);
	}, []);

	return (
		<>
			<div className="command-header">
				<h1>Create Role Command</h1>
				<button onClick={() => setCreatingCommand(false)}>
					<ClearIcon />
				</button>
			</div>
			<div className="command-body">
				<h4 className="plugin-section-title">Command Name</h4>
				<div className="plugin-section">
					<input
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
					<Select
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
						styles={{
							...colorStyles,
							container: styles => ({
								...styles,
								...colorStyles.container,
							}),
						}}
					/>
				</div>
				<h4 className="plugin-section-title">Banned Roles</h4>
				<div className="plugin-section">
					<Select
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
						styles={{
							...colorStyles,
							container: styles => ({
								...styles,
								...colorStyles.container,
							}),
						}}
					/>
				</div>
				<h4 className="plugin-section-title">Allowed Channels</h4>
				<div className="plugin-section">
					<Select
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
						styles={{
							...colorStyles,
							container: styles => ({
								...styles,
								...colorStyles.container,
							}),
						}}
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
                        const commands = (await firebase.db.collection("customCommands").doc(userConnectedGuildInfo.id).get()).data()
                        console.log(commands)
                        if(commands[name]) return setError({message: "A Command with that name already exists"})
						const parsedAllowedRoles = parseSelectValue(allowedRoles);
						const parsedBannedRoles = parseSelectValue(bannedRoles);
						const parsedAllowedChannels = parseSelectValue(allowedChannels);
						const parsedRoleToGive = parseSelectValue(roleToGive);
						console.log({
							name,
							response,
							parsedRoleToGive,
							description,
							parsedAllowedRoles,
							parsedBannedRoles,
							parsedAllowedChannels,
							cooldown,
							deleteUsage,
						});
					}}
				>
					Create
				</button>
			</div>
		</>
	);
};

export default CreateCommand;
