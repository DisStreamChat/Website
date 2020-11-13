import { useEffect, useState, useCallback, useContext } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import firebase from "../../../../firebase";
import PluginCard from "./PluginCard";
import { DiscordContext } from "../../../../contexts/DiscordContext";
import Leveling from "./Leveling";
import Logging from "./Logging";
import plugins from "./plugins.json";
import CustomCommands from "./CustomCommands/CustomCommands";
import { CommandContextProvider } from "../../../../contexts/CommandContext";
import { RoleContextProvider } from "../../../../contexts/RoleContext";
import Roles from "./Roles/Roles";

const PluginHome = ({ match, guildId, connectedGuild, blank }) => {
	const [prefix, setPrefix] = useState("!");
	const { activePlugins, setActivePlugins, saveOnType } = useContext(DiscordContext);
	const connectedGuildId = connectedGuild?.id || " ";
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		(async () => {
			setLoading(true);
			const guild = await firebase.db
				.collection("DiscordSettings")
				.doc(connectedGuild?.id || " ")
				.get();
			const data = guild.data();
			if (data) {
				setPrefix(data.prefix || "!");
				setActivePlugins(data.activePlugins);
			} else {
				await firebase.db
					.collection("DiscordSettings")
					.doc(connectedGuild?.id || " ")
					.set({ activePlugins: {}, prefix: "!" });
				setActivePlugins({});
				setPrefix("!");
			}
			setTimeout(() => {
				setLoading(false);
			}, 300);
		})();
	}, [connectedGuild, setActivePlugins]);

	const prefixChange = useCallback(
		async e => {
			const value = e?.target?.value || "!";
			setPrefix(value);
			try {
				await firebase.db
					.collection("DiscordSettings")
					.doc(connectedGuildId || " ")
					.update({
						prefix: value,
					});
			} catch (err) {
				await firebase.db
					.collection("DiscordSettings")
					.doc(connectedGuildId || " ")
					.set({
						activePlugins: {},
						prefix: value,
					});
			}
			saveOnType();
		},
		[connectedGuildId, saveOnType]
	);

	return (
		<span className={blank ? "blank-home" : ""}>
			<hr />
			<div className="discord-prefix">
				<label htmlFor="discord-prefix">
					<h2 className="prefix-header">Command Prefix</h2>
					<h3 className="prefix-subheader">
						Set the prefix used to run DisStreamBot commands in this discord server
					</h3>
				</label>
				<div className="prefix-body">
					<input
						value={prefix}
						onChange={prefixChange}
						type="text"
						className="prefix-input"
						id="discord-prefix"
					/>
					<span className="ping-info">
						or <span className="ping">@DisStreamBot</span>
					</span>
				</div>
			</div>
			<hr />
			<div className="plugins">
				<Switch>
					<Route exact path={`${match.url}`}>
						<div className="plugin-header">
							<h2>Plugins</h2>
							<h3>
								Add extra functionality to the bot in your server with plugins like
								leveling, custom commands, and logging
							</h3>
						</div>

						<div className="plugin-list">
							{plugins.filter(plugin => !plugin.comingSoon).map(plugin => (
								<PluginCard
									guild={guildId}
									key={plugin.id}
									{...plugin}
									active={activePlugins[plugin.id]}
								/>
							))}
						</div>
					</Route>
					{(activePlugins["leveling"] || loading) && (
						<Route path={`${match.url}/leveling`}>
							<Leveling guild={connectedGuild} />
						</Route>
					)}
					{(activePlugins["logging"] || loading) && (
						<Route path={`${match.url}/logging`}>
							<Logging guild={connectedGuild} />
						</Route>
					)}
					{(activePlugins["commands"] || loading) && (
						<Route path={`${match.url}/commands`}>
							<CommandContextProvider>
								<CustomCommands guild={connectedGuild} />
							</CommandContextProvider>
						</Route>
					)}
					{(activePlugins["roles"] || loading) && (
						<Route path={`${match.url}/roles`}>
							<CommandContextProvider>
								<RoleContextProvider>
									<Roles guild={connectedGuild} />
								</RoleContextProvider>
							</CommandContextProvider>
						</Route>
					)}
					<Redirect to={`${match.url}`} />
				</Switch>
			</div>
		</span>
	);
};

export default PluginHome;
