import React, { createContext } from "react";
import { useState } from "react";
import _ from "lodash"

export const DiscordContext = createContext({});

DiscordContext.displayName = "Discord Context"

export const DiscordContextProvider = props => {
	const [userDiscordInfo, setUserDiscordInfo] = useState();
	const [userConnectedGuildInfo, setUserConnectedGuildInfo] = useState();
	const [userConnectedChannels, setUserConnectedChannels] = useState();
	const [activePlugins, setActivePlugins] = useState({});
	const [dashboardOpen, setDashboardOpen] = useState(false);
	const saveOnType = _.debounce(() => {
		setDashboardOpen(true);
	}, 100)

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
				saveOnType
			}}
		>
			{props.children}
		</DiscordContext.Provider>
	);
};
