import React, { useEffect, useState, useCallback, useContext } from "react";
import firebase from "../../../../firebase";
import { colorStyles } from "../../../Shared/userUtils";
import { DiscordContext } from "../../../../contexts/DiscordContext";
import Select from "react-select";

const Leveling = ({ location, guild: userConnectedGuildInfo }) => {
	const { setActivePlugins } = useContext(DiscordContext);
	const guildId = userConnectedGuildInfo?.id;

	useEffect(() => {
		(async () => {
			const guild = await firebase.db
				.collection("Leveling")
				.doc(guildId || " ")
				.get();
			const data = guild.data();
			if (data) {
				const id = data.notifications;
				if (id) {
					const apiUrl = `${process.env.REACT_APP_API_URL}/resolvechannel?guild=${guildId}&channel=${id}`;
					const response = await fetch(apiUrl);
					const channel = await response.json();
				}
			}
		})();
	}, [location, guildId]);

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
				<h4 className="plugin-section-title">Add an action</h4>
				<div className="plugin-section"></div>
			</div>
		</div>
	);
};

export default React.memo(Leveling);
