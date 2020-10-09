import React, { useEffect, useState, useCallback, useContext } from "react";
import firebase from "../../../../firebase";
import { colorStyles } from "../../../Shared/userUtils";
import { DiscordContext } from "../../../../contexts/DiscordContext";
import Select from "react-select";

const App = ({ location }) => {
	const [levelUpAnnouncement, setLevelUpAnnouncement] = useState();
	const [announcementChannel, setAnnouncementChannel] = useState(false);
	const [levelUpMessage, setLevelUpMessage] = useState("Congrats {player}, you leveled up to level {level}!");
    const {setActivePlugins, userConnectedGuildInfo} = useContext(DiscordContext)
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

	return (
		<div>
			<div className="plugin-item-header">
				<span className="title">
					<img src={`${process.env.PUBLIC_URL}/trophy.svg`} alt="" />
					<h2>Leveling</h2>
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
				<h2>Leveling Up</h2>
				<h4>Whenever a user gains a level, DisStreamBot can send a personalized message.</h4>
			</div>
			<div className="plugin-item-body">
				<div className="level-settings">
					<div className="channels">
						<div id="announcement-type">
							<h5 className="bold uppercase">Level up announcement</h5>
							<Select
								closeMenuOnSelect
								onChange={handleTypeSelect}
								placeholder="Select Annoucement type"
								value={levelUpAnnouncement}
								options={[
									{ value: 1, label: "Disabled" },
									{ value: 2, label: "Current Channel" },
									{ value: 3, label: "Custom Channel" },
								].map(type => type)}
								styles={{
									...colorStyles,
									container: styles => ({ ...styles, ...colorStyles.container }),
								}}
							/>
						</div>
						{levelUpAnnouncement?.value === 3 && (
							<div id="announcement-channel">
								<h5 className="bold uppercase">ANNOUNCEMENT CHANNEL</h5>
								<Select
									closeMenuOnSelect
									onChange={handleAnnoucmentSelect}
									placeholder="Select Annoucement Channel"
									value={announcementChannel}
									options={userConnectedGuildInfo?.channels
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
									styles={{
										...colorStyles,
										container: styles => ({
											...styles,
											...colorStyles.container,
										}),
									}}
								/>
							</div>
						)}
					</div>
					<div className="message">
						<h5>LEVEL UP ANNOUNCEMENT MESSAGE</h5>
						<textarea value={levelUpMessage} onChange={handleMessageChange}></textarea>
					</div>
				</div>
			</div>
		</div>
	);
};

export default React.memo(App);
