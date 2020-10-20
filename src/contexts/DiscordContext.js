import React, { createContext } from "react";
import { useState } from "react";

export const DiscordContext = createContext({});

export const DiscordContextProvider = props => {
	const [userDiscordInfo, setUserDiscordInfo] = useState();
	const [userConnectedGuildInfo, setUserConnectedGuildInfo] = useState();
	const [userConnectedChannels, setUserConnectedChannels] = useState();
	const [activePlugins, setActivePlugins] = useState({});
	const [dashboardOpen, setDashboardOpen] = useState(false);

	return (
		<DiscordContext.Provider
			value={{
				userDiscordInfo,
				setUserDiscordInfo,
				userConnectedChannels,
				userConnectedGuildInfo,
				setUserConnectedChannels,
				setUserConnectedGuildInfo,
				activePlugins,
				setActivePlugins,
				dashboardOpen,
				setDashboardOpen,
			}}
		>
			{props.children}
		</DiscordContext.Provider>
	);
};
