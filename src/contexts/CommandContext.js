import React, { createContext } from "react";
import { useState } from "react";

export const CommandContext = createContext({});

export const CommandContextProvider = props => {
	const [name, setName] = useState("");
	const [response, setResponse] = useState("");
	const [roleToGive, setRoleToGive] = useState("");
	const [description, setDescription] = useState("");
	const [allowedRoles, setAllowedRoles] = useState([]);
	const [bannedRoles, setBannedRoles] = useState([]);
	const [allowedChannels, setAllowedChannels] = useState([]);
	const [cooldown, setCooldown] = useState(0);
	const [deleteUsage, setDeleteUsage] = useState(false);
	const [editing, setEditing] = useState(false);
	const [error, setError] = useState({});

	return (
		<CommandContext.Provider
			value={{
				editing,
				setEditing,
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
			}}
		>
			{props.children}
		</CommandContext.Provider>
	);
};
