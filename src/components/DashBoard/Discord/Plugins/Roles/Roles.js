import React, { useEffect, useState, useCallback, useContext } from "react";
import firebase from "../../../../../firebase";
import { colorStyles } from "../../../../Shared/userUtils";
import { DiscordContext } from "../../../../../contexts/DiscordContext";
import Select from "react-select";
import ManagerItem from "./ManagerItem";

const Leveling = ({ location, guild: userConnectedGuildInfo }) => {
	const [MessageManagers, setMessageManagers] = useState([]);
	const [JoinManager, setJoinManager] = useState();
	const { setActivePlugins } = useContext(DiscordContext);
	const guildId = userConnectedGuildInfo?.id;

	useEffect(() => {
		(async () => {
			const guild = await firebase.db
				.collection("reactions")
				.doc(guildId || " ")
				.get();
			const data = guild.data();
			if (data) {
				const managerKeys = Object.keys(data).filter(key => key !== "member-join");
				setMessageManagers(managerKeys.map(key => ({ message: key, ...data[key] })));
				if (data["member-join"]) {
					setJoinManager(data["member-join"]);
				}
			}
		})();
	}, [location, guildId]);

	console.log(MessageManagers);

	return (
		<div>
			<div className="plugin-item-header">
				<span className="title">
					<img src={`${process.env.PUBLIC_URL}/trophy.svg`} alt="" />
					<h2>Role Management</h2>
				</span>
				<span className="toggle-button">
					<button
						onClick={() => {
							setActivePlugins(prev => {
								const newPlugs = { ...prev, roles: false };
								firebase.db
									.collection("DiscordSettings")
									.doc(guildId || " ")
									.update({
										activePlugins: newPlugs,
									});
								return newPlugs;
							});
						}}
					>
						Disable
					</button>
				</span>
			</div>
			<hr />
			<div className="plugin-item-subheader">
				<h4>Different ways to have the bot manage user roles. Give a role on join, toggle roles with reactions, etc.</h4>
			</div>
			<div className="plugin-item-body">
				<h4 className="plugin-section-title">Create Manager</h4>
				<div className="command-card-body">
					<div
						className="create-command"
						onClick={() => {
							// setupCommand();
							// setCreatingCommand("text");
						}}
					>
						<h1>Message Manager</h1>
						<p>allow users to give/remove roles from themeselves by reacting to a message</p>
					</div>
					{!JoinManager && (
						<div
							className="create-command"
							onClick={() => {
								// setupCommand();
								// setCreatingCommand("role");
							}}
						>
							<h1>Member Join Manager</h1>
							<p>Automatically Give a user a roll when they join your server</p>
						</div>
					)}
				</div>
				{JoinManager && (
					<>
						<h4 className="plugin-section-title bigger">Member Join Manager</h4>
						<ManagerItem guild={userConnectedGuildInfo} {...JoinManager} join channelOveride="Member Join" />
					</>
				)}
				<h4 className="plugin-section-title bigger">
					Message Managers<span> — {MessageManagers.length}</span>
				</h4>
				{MessageManagers.sort((a, b) => a.message.localeCompare(b.message)).map(manager => (
					<ManagerItem {...manager} guild={userConnectedGuildInfo} />
				))}
			</div>
		</div>
	);
};

export default React.memo(Leveling);
