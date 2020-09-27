import React, { useEffect, useState, useCallback, useContext } from "react";
import firebase from "../../../../firebase";
import { colorStyles } from "../../../Shared/userUtils";
import { DiscordContext } from "../../../../contexts/DiscordContext";
import Select from "react-select";

const Leveling = ({ location }) => {
    const [loggingChannel, setLoggingChannel] = useState("")
    const [activeEvents, setActiveEvents] = useState({})
	const { setActivePlugins, userConnectedGuildInfo } = useContext(DiscordContext);
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
					setAnnouncementChannel({
						value: id,
						label: (
							<>
								<span>{channel.name}</span>
								<span className="channel-category">{channel.parent}</span>
							</>
						),
					});
					setLevelUpAnnouncement({
						value: data.type,
						label: ["Disabled", "Current Channel", "Custom Channel"][data.type - 1],
					});
					setLevelUpMessage(data.message);
				}
			}
		})();
	}, [location, guildId]);

	return (
		<div>
			<div className="plugin-item-header">
				<span className="title">
					<img src={`${process.env.PUBLIC_URL}/clipboard.svg`} alt="" />
					<h2>Logging</h2>
				</span>
				<span className="toggle-button">
					<button
						onClick={() => {
							setActivePlugins(prev => {
								const newPlugs = { ...prev, leveling: false };
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
				<h2>Logging Channel</h2>
				<h4>
					You can set a channel and events that will be sent to that particular channel. Don't miss anything happening in your server when
					you are not around!
				</h4>
			</div>
			<div className="plugin-item-body">
				
			</div>
		</div>
	);
};

export default React.memo(Leveling);
