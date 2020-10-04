import { DiscordContext } from "../../../../contexts/DiscordContext";
import React, { useEffect, useState, useCallback, useContext } from "react";
import ClearIcon from "@material-ui/icons/Clear";

const CreateTextCommand = ({ setCreatingCommand }) => {
	const { setActivePlugins, userConnectedGuildInfo } = useContext(DiscordContext);
	return (
		<>
			<div className="command-header">
				<h1>Create Text Command</h1>
				<button onClick={() => setCreatingCommand(false)}>
					<ClearIcon />
				</button>
			</div>
			<div className="command-body">
				<h4 className="plugin-section-title">Command Name</h4>
				<div className="plugin-section">
					<input placeholder="Command Name (Don't include prefix)" type="text" className="prefix-input" id="discord-prefix" />
				</div>
				<h4 className="plugin-section-title">Command Response</h4>
				<div className="plugin-section">
					<textarea placeholder="Hi, {user}!" rows="8" className="message"></textarea>
					<div className="variables">
						<h4 className="plugin-section-title">Available variables</h4>
						<ul>
							<li className="variable">{"{author} - The user who sent the command"}</li>
						</ul>
					</div>
				</div>
			</div>
			<div className="command-footer"></div>
		</>
	);
};

export default CreateTextCommand;
