import ClearIcon from "@material-ui/icons/Clear";
import { DiscordContext } from "../../../../contexts/DiscordContext";
import React, { useEffect, useState, useCallback, useContext } from "react";
import Select from "react-select";
import { colorStyles } from "../../../Shared/userUtils";

const CreateRoleCommand = ({ setCreatingCommand }) => {
	const { setActivePlugins, userConnectedGuildInfo } = useContext(DiscordContext);
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
					<input placeholder="Command Name (Don't include prefix)" type="text" className="prefix-input" id="discord-prefix" />
				</div>
				<h4 className="plugin-section-title">Role To give</h4>
				<div className="plugin-section">
                <Select
						closeMenuOnSelect
						onChange={() => {}}
						placeholder="Select Logging Channel"
						value={"loggingChannel"}
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
			</div>
			<div className="command-footer"></div>
		</>
	);
};

export default CreateRoleCommand;
