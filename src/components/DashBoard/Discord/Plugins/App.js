import React, { useEffect, useState, useCallback, useContext } from "react";
import firebase from "../../../../firebase";
import { colorStyles } from "../../../Shared/userUtils";
import { DiscordContext } from "../../../../contexts/DiscordContext";
import Select from "react-select";

const App = ({ location }) => {
	const [levelUpAnnouncement, setLevelUpAnnouncement] = useState();
	const [announcementChannel, setAnnouncementChannel] = useState(false);
	const [levelUpMessage, setLevelUpMessage] = useState("Congrats {player}, you leveled up to level {level}!");
	const {
		userDiscordInfo,
		setUserDiscordInfo,
		userConnectedChannels,
		userConnectedGuildInfo,
		setUserConnectedChannels,
		setUserConnectedGuildInfo,
	} = useContext(DiscordContext);
	const guildId = userConnectedGuildInfo?.id;

	const handleTypeSelect = useCallback(
		async e => {
			const guildLevelRef = firebase.db.collection("Leveling").doc(guildId);
			setLevelUpAnnouncement(e);
			await guildLevelRef.update({ type: e.value });
		},
		[guildId]
	);

	const handleMessageChange = useCallback(
		async e => {
			const guildLevelRef = firebase.db.collection("Leveling").doc(guildId);
			const message = e.target.value;
			setLevelUpMessage(message);
			await guildLevelRef.update({ message });
		},
		[guildId]
	);

	const handleAnnoucmentSelect = useCallback(
		async e => {
			const guildLevelRef = firebase.db.collection("Leveling").doc(guildId);
			setAnnouncementChannel(e);
			guildLevelRef.update({ notifications: e.value });
		},
		[guildId]
	);

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
    
    const onChannelSelect = useCallback(
		async e => {
			setUserConnectedGuildInfo(s => ({
				...s,
				connectedChannels:
					e?.map(c => ({
						id: c.value,
						name: c.label.props.children[0].props.children,
						parent: c.label.props.children[1].props.children,
					})) || [],
			}));
			await firebase.db
				.collection("Streamers")
				.doc(guildId)
				.update({
					liveChatId: e?.map(c => c.value) || [],
				});
			await firebase.db
				.collection("Streamers")
				.doc(guildId)
				.collection("discord")
				.doc("data")
				.update({
					liveChatId: e?.map(c => c.value) || [],
				});
		},
		[guildId, setUserConnectedGuildInfo]
	);

	return (
		<div>
			<div className="plugin-item-header">
				<span className="title">
					<img src={`${process.env.PUBLIC_URL}/trophy.svg`} alt="" />
					<h2>Leveling</h2>
				</span>
				
			</div>
			<hr />
			<div className="plugin-item-subheader">
				<h2>Leveling Up</h2>
				<h4>Whenever a user gains a level, DisStreamBot can send a personalized message.</h4>
			</div>
			<div className="plugin-item-body">
				<>
					{userConnectedGuildInfo.connected ? (
						<>
							<h3>select channels to listen to</h3>
							<Select
								closeMenuOnSelect={false}
								onChange={onChannelSelect}
								placeholder="Select Channel"
								value={userConnectedGuildInfo.connectedChannels
									?.sort((a, b) => a.parent.localeCompare(b.parent))
									?.map(channel => ({
										value: channel.id,
										label: (
											<>
												<span>{channel.name}</span>
												<span className="channel-category">{channel.parent}</span>
											</>
										),
									}))}
								options={userConnectedGuildInfo.channels
									.sort((a, b) => a.parent.localeCompare(b.parent))
									.map(channel => ({
										value: channel.id,
										label: (
											<>
												<span>{channel.name}</span>
												<span className="channel-category">{channel.parent}</span>
											</>
										),
									}))}
								styles={{
									...colorStyles,
									container: styles => ({ ...styles, ...colorStyles.container }),
								}}
								isMulti
							/>
						</>
					) : (
						<>
							<span>
								This server is not connected to the DisStreamChat chat manager, connect it to get discord messages in your app and
								adjust your plugin settings
							</span>
						</>
					)}
				</>
			</div>
		</div>
	);
};

export default React.memo(App);
