import { createContext } from "react";
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

	const setup = () => {
		setName("");
		setResponse("");
		setRoleToGive("");
		setDescription("");
		setAllowedChannels([]);
		setAllowedRoles([]);
		setBannedRoles([]);
		setCooldown(0);
		setDeleteUsage(false);
		setEditing(false);
		setError({});
	};

	return (
		<CommandContext.Provider
			value={{
				setup,
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
