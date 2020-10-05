import { DiscordContext } from "../../../../contexts/DiscordContext";
import React, { useEffect, useState, useCallback, useContext } from "react";
import ClearIcon from "@material-ui/icons/Clear";

const CreateTextCommand = ({ setCreatingCommand }) => {
	const { setActivePlugins, userConnectedGuildInfo } = useContext(DiscordContext);
	return (
		<>
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
		</>
	);
};

export default CreateTextCommand;
