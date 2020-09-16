import React, { useEffect, useState, useCallback, useContext, useMemo } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import firebase from "../../../../firebase";
import A from "../../../Shared/A";
import PluginCard from "./PluginCard";
import { DiscordContext } from "../../../../contexts/DiscordContext";
import Leveling from "./Leveling";
import plugins from "./plugins.json"

const PluginHome = ({ match }) => {
	const [prefix, setPrefix] = useState("!");
	const { userConnectedGuildInfo, activePlugins, setActivePlugins } = useContext(DiscordContext);

	useEffect(() => {
		(async () => {
			const guild = await firebase.db
				.collection("DiscordSettings")
				.doc(userConnectedGuildInfo?.id || " ")
				.get();
			const data = guild.data();
			if (data) {
				setPrefix(data.prefix || "!");
				setActivePlugins(data.activePlugins);
			} else {
				setPrefix("!");
			}
		})();
	}, [userConnectedGuildInfo]);

	const prefixChange = useCallback(
		async e => {
			setPrefix(e.target.value);
			try{

				firebase.db
					.collection("DiscordSettings")
					.doc(userConnectedGuildInfo?.id || " ")
					.update({
						prefix: e.target.value,
					});
			}catch(err){
				firebase.db
					.collection("DiscordSettings")
					.doc(userConnectedGuildInfo?.id || " ")
					.set({
						prefix: e.target.value,
					});
			}
		},
		[userConnectedGuildInfo?.id]
	);

    const displayPlugins = useMemo(() => plugins.sort((a, b) => activePlugins[a.id] ? -1 : 1), [plugins, activePlugins])

	return (
		<>
			<hr />
			<div className="discord-prefix">
				<label htmlFor="discord-prefix">
					<h2 className="prefix-header">Command Prefix</h2>
					<h3 className="prefix-subheader">Set the prefix used to run DisStreamBot commands in this discord server</h3>
				</label>
				<div className="prefix-body">
					<input value={prefix} onChange={prefixChange} type="text" className="prefix-input" id="discord-prefix" />
				</div>
			</div>
			<hr />
			<div className="plugins">
				<Switch>
					<Route exact path={`${match.url}`}>
						<div className="plugin-header">
							<h2>Plugins</h2>
							<h3>Add extra functionality to the bot in your server with plugins like leveling, custom commands, and logging</h3>
						</div>

						<div className="plugin-list">
                            {displayPlugins.map(plugin => (
                                <PluginCard {...plugin} active={activePlugins[plugin.id]}/>
                            ))}
						</div>
					</Route>
					{activePlugins["leveling"] &&
						<Route path={`${match.url}/leveling`}>
							<Leveling />
						</Route>
					}
					<Redirect to={`${match.url}`} />
				</Switch>
			</div>
		</>
	);
};

export default PluginHome;
