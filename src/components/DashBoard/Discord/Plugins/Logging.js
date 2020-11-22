import { memo, Fragment, useEffect, useState, useCallback, useContext } from "react";
import firebase from "../../../../firebase";
import { DiscordContext } from "../../../../contexts/DiscordContext";
import { Tooltip } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import InfoTwoToneIcon from "@material-ui/icons/InfoTwoTone";
import StyledSelect from "../../../../styled-components/StyledSelect";
import FancySwitch from "../../../../styled-components/FancySwitch";
import { channelLabel, TransformObjectToSelectValue } from "../../../../utils/functions";

const Leveling = ({ location, guild: userConnectedGuildInfo }) => {
	const [loggingChannel, setLoggingChannel] = useState("");
	const [activeEvents, setActiveEvents] = useState({});
	const [allEvents, setAllEvents] = useState({});
	const { setDashboardOpen } = useContext(DiscordContext);
	const [channelOverrides, setChannelOverrides] = useState({});
	const guildId = userConnectedGuildInfo?.id;

	useEffect(() => {
		(async () => {
			const guildLogRef = firebase.db.collection("loggingChannel").doc(guildId || " ");
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
				const overrides = data.channelOverrides || {};
				const overridesToSet = {};
				for (const [key, value] of Object.entries(overrides)) {
					if (!value) continue;
					const apiUrl = `${process.env.REACT_APP_API_URL}/resolvechannel?guild=${guildId}&channel=${value}`;
					const response = await fetch(apiUrl);
					const channel = await response.json();
					overridesToSet[key] = {
						value: value,
						label: (
							<>
								<span>{channel.name}</span>
								<span className="channel-category">{channel.parent}</span>
							</>
						),
					};
				}
				console.log(overridesToSet);
				setChannelOverrides(overridesToSet);
				const active = data.activeEvents;
				setActiveEvents(active || {});
			} else {
				const docRef = firebase.db.collection("loggingChannel").doc(guildId || " ");
				try {
					await docRef.update({});
				} catch (err) {
					await docRef.set({});
				}
			}
		})();
		(async () => {
			const defaultEvents = (
				await firebase.db.collection("defaults").doc("loggingEvents").get()
			).data();
			console.log(defaultEvents);
			setAllEvents(defaultEvents);
		})();
	}, [location, guildId]);

	const handleOverrideSelect = useCallback(
		async (e, category) => {
			setChannelOverrides(prev => ({
				...prev,
				[category]: e,
			}));
			const docRef = firebase.db.collection("loggingChannel").doc(guildId);
			try {
				await docRef.update({
					[`channelOverrides.${category}`]: e?.value || false,
				});
			} catch (err) {
				await docRef.set({
					[`channelOverrides.${category}`]: e?.value || false,
				});
			}
			setDashboardOpen(true);
		},
		[guildId, setDashboardOpen]
	);

	const handleEventToggle = useCallback(
		async (value, id) => {
			setActiveEvents(prev => ({
				...prev,
				[id]: value,
			}));
			const docRef = firebase.db.collection("loggingChannel").doc(guildId);
			try {
				await docRef.update({
					[`activeEvents.${id}`]: value,
				});
			} catch (err) {
				await docRef.set({
					[`activeEvents.${id}`]: value,
				});
			}
			setDashboardOpen(true);
		},
		[guildId, setDashboardOpen]
	);

	const handleAnnoucmentSelect = useCallback(
		async e => {
			const guildLevelRef = firebase.db.collection("loggingChannel").doc(guildId);
			setLoggingChannel(e);
			try {
				await guildLevelRef.update({ server: e.value });
			} catch (err) {
				await guildLevelRef.set({ server: e.value });
			}
			setDashboardOpen(true);
		},
		[guildId, setDashboardOpen]
	);

	return (
		<div>
			<div className="plugin-item-header">
				<span className="title">
					<img src={`${process.env.PUBLIC_URL}/clipboard.svg`} alt="" />
					<h2>Logging</h2>
				</span>
			</div>
			<hr />
			<div className="plugin-item-subheader">
				<h4>
					You can set a channel and events that will be sent to that particular channel.
					Don't miss anything happening in your server when you are not around!
				</h4>
			</div>
			<div className="plugin-item-body">
				<h4 className="plugin-section-title">Logging Channel</h4>
				<div className="plugin-section">
					<StyledSelect
						isClearable
						closeMenuOnSelect
						onChange={handleAnnoucmentSelect}
						placeholder="Select Logging Channel"
						value={loggingChannel}
						options={userConnectedGuildInfo?.channels
							?.sort((a, b) => a.parent.localeCompare(b.parent))
							?.map(channel => ({
								value: TransformObjectToSelectValue(channel),
								label: channelLabel(channel),
							}))}
					/>
				</div>
				{[...new Set(Object.values(allEvents || {}).map(val => val.category))]
					.sort()
					.map(category => (
						<Fragment key={category}>
							<h4 className="plugin-section-title">{category}</h4>
							<div className="plugin-section">
								<h4 className="plugin-section-title">
									Category Logging Channel Override{" "}
									<Tooltip
										placement="top"
										arrow
										title="If set, events in this category will be logged in this channel instead of the default"
									>
										<InfoTwoToneIcon />
									</Tooltip>
								</h4>
								<div className="plugin-section subtitle" style={{ width: "100%" }}>
									<StyledSelect
										isClearable
										closeMenuOnSelect
										onChange={e => {
											handleOverrideSelect(e, category);
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
														<span className="channel-category">
															{channel.parent}
														</span>
													</>
												),
											}))}
									/>
								</div>
								<h4 className="plugin-section-title" style={{ width: "100%" }}>
									Events
								</h4>

								{Object.entries(allEvents || {})
									.filter(([key, event]) => event.category === category)
									.sort()
									.map(([key, event]) => (
										<FormControlLabel
											key={key}
											control={
												<FancySwitch
													color="primary"
													checked={!!activeEvents[key]}
													onChange={(e, value) => {
														handleEventToggle(value, key);
													}}
													name={event.displayName}
												/>
											}
											label={event.displayName}
										/>
									))}
							</div>
						</Fragment>
					))}
			</div>
		</div>
	);
};

export default memo(Leveling);
