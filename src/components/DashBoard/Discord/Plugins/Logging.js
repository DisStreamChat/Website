import React, { useEffect, useState, useCallback, useContext } from "react";
import firebase from "../../../../firebase";
import { DiscordContext } from "../../../../contexts/DiscordContext";
import { colorStyles } from "../../../Shared/userUtils";
import Select from "react-select";

const Leveling = ({ location }) => {
	const [loggingChannel, setLoggingChannel] = useState("");
	const [activeEvents, setActiveEvents] = useState({});
	const [allEvents, setAllEvents] = useState({});
	const { setActivePlugins, userConnectedGuildInfo } = useContext(DiscordContext);
	const guildId = userConnectedGuildInfo?.id;

	useEffect(() => {
		(async () => {
            const guildLogRef = firebase.db.collection("loggingChannel").doc(guildId);
            const data = (await guildLogRef.get()).data()
            if (data) {
				const id = data.server;
				if (id) {
					const apiUrl = `${process.env.REACT_APP_API_URL}/resolvechannel?guild=${guildId}&channel=${id}`;
					const response = await fetch(apiUrl);
					const channel = await response.json();
					setLoggingChannel({
						value: id,
						label: (
							<>
								<span>{channel.name}</span>
								<span className="channel-category">{channel.parent}</span>
							</>
						),
					});
				}
			}
        })();
	}, [location, guildId]);

	const handleAnnoucmentSelect = useCallback(
		async e => {
			const guildLevelRef = firebase.db.collection("loggingChannel").doc(guildId);
			setLoggingChannel(e);
			guildLevelRef.update({ server: e.value });
		},
		[guildId]
	);

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
				<h4>
					You can set a channel and events that will be sent to that particular channel. Don't miss anything happening in your server when
					you are not around!
				</h4>
			</div>
			<div className="plugin-item-body">
				<h4 className="plugin-section-title">Logging Channel</h4>
				<div className="plugin-section">
					<Select
						closeMenuOnSelect
						onChange={handleAnnoucmentSelect}
						placeholder="Select Logging Channel"
						value={loggingChannel}
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
			</div>
		</div>
	);
};

export default React.memo(Leveling);
