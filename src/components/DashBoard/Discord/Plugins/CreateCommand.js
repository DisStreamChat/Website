import ClearIcon from "@material-ui/icons/Clear";
import { DiscordContext } from "../../../../contexts/DiscordContext";
import React, { useEffect, useState, useCallback, useContext } from "react";
import Select from "react-select";
import { colorStyles } from "../../../Shared/userUtils";
import RoleItem from "../../../Shared/RoleItem";

const CreateCommand = ({ setCreatingCommand, children }) => {
	const { setActivePlugins, userConnectedGuildInfo } = useContext(DiscordContext);
	console.log(userConnectedGuildInfo);
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
					<input placeholder="Command Name (Don't include prefix)" type="text" className="prefix-input" id="command-name" />
				</div>
				{children}
				<h4 className="plugin-section-title">Command Description</h4>
				<div className="plugin-section">
					<input placeholder="A very cool command" type="text" className="prefix-input" id="command-description" />
				</div>
				<h4 className="plugin-section-title">Allowed Roles</h4>
				<div className="plugin-section">
					<Select
						closeMenuOnSelect
						onChange={() => {}}
						placeholder="Select Command Role"
						value={undefined}
						options={userConnectedGuildInfo?.roles
							?.filter(role => role.name !== "@everyone")
							?.sort((a, b) => b.rawPosition - a.rawPosition)
							?.map(role => ({
								value: `${role.name}:${role.id}`,
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
						closeMenuOnSelect
						onChange={() => {}}
						placeholder="Select Logging Channel"
						value={null}
						options={userConnectedGuildInfo?.channels
							?.sort((a, b) => a.parent.localeCompare(b.parent))
							?.map(channel => ({
								value: channel.id,
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
				<h4 className="plugin-section-title">Allowed Channels</h4>
				<div className="plugin-section">
					<Select
						closeMenuOnSelect
						onChange={() => {}}
						placeholder="Select Logging Channel"
						value={null}
						options={userConnectedGuildInfo?.channels
							?.sort((a, b) => a.parent.localeCompare(b.parent))
							?.map(channel => ({
								value: channel.id,
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
					<input placeholder="Cooldown" type="number" className="prefix-input" id="command-cooldown" />
				</div>
			</div>
			<div className="command-footer">
				<button>Create</button>
			</div>
		</>
	);
};

export default CreateCommand;
