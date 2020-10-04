import React, { useEffect, useState, useCallback, useContext } from "react";
import firebase from "../../../../firebase";
import { DiscordContext } from "../../../../contexts/DiscordContext";
import { colorStyles } from "../../../Shared/userUtils";
import Select from "react-select";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Switch } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { blueGrey } from "@material-ui/core/colors";

const FancySwitch = withStyles({
	root: {
		padding: 7,
	},
	thumb: {
		width: 24,
		height: 24,
		backgroundColor: "#fff",
		boxShadow: "0 0 12px 0 rgba(0,0,0,0.08), 0 0 8px 0 rgba(0,0,0,0.12), 0 0 4px 0 rgba(0,0,0,0.38)",
	},
	switchBase: {
		color: "rgba(0,0,0,0.38)",
		padding: 7,
	},
	track: {
		borderRadius: 20,
		backgroundColor: blueGrey[300],
	},
	checked: {
		"& $thumb": {
			backgroundColor: "#fff",
		},
		"& + $track": {
			opacity: "1 !important",
		},
	},
	focusVisible: {},
})(Switch);

const Leveling = ({ location }) => {
	const [loggingChannel, setLoggingChannel] = useState("");
	const [activeEvents, setActiveEvents] = useState({});
	const [allEvents, setAllEvents] = useState({});
	const { setActivePlugins, userConnectedGuildInfo } = useContext(DiscordContext);
	const [channelOverrides, setChannelOverrides] = useState({});
	const guildId = userConnectedGuildInfo?.id;

	useEffect(() => {
		(async () => {
			const guildLogRef = firebase.db.collection("loggingChannel").doc(guildId);
			const data = (await guildLogRef.get()).data();
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
		(async () => {
			const defaultEvents = (await firebase.db.collection("defaults").doc("loggingEvents").get()).data();
			console.log(defaultEvents);
			setAllEvents(defaultEvents);
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
				{[...new Set(Object.values(allEvents || {}).map(val => val.category))].sort().map(category => (
					<>
						<h4 className="plugin-section-title">{category}</h4>
						<div className="plugin-section">
							<h4 className="plugin-section-title">Channel Override</h4>
							<div className="plugin-section subtitle" style={{ width: "100%" }}>
								<Select
									closeMenuOnSelect
									onChange={e => {
                                        setChannelOverrides(prev => ({
                                            ...prev,
                                            [category]: e
                                        }))
                                    }}
									placeholder="Logging Channel Override"
									value={channelOverrides[category] || ""}
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
							<h4 className="plugin-section-title" style={{ width: "100%" }}>
								Events
							</h4>

							{Object.entries(allEvents || {})
								.filter(([key, event]) => event.category === category)
								.map(([key, event]) => (
									<FormControlLabel
										control={
											<FancySwitch
												color="primary"
												checked={activeEvents[key]}
												onChange={e => {
													setActiveEvents(prev => ({
														...prev,
														[key]: e.target.checked,
													}));
												}}
												name={event.displayName}
											/>
										}
										label={event.displayName}
									/>
								))}
						</div>
					</>
				))}
			</div>
		</div>
	);
};

export default React.memo(Leveling);
