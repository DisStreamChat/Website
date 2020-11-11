import { memo, useEffect, useState, useCallback, useContext } from "react";
import firebase from "../../../../firebase";
import { DiscordContext } from "../../../../contexts/DiscordContext";
import { Link } from "react-router-dom";
import StyledSelect from "../../../../styled-components/StyledSelect";
import { Typography } from "@material-ui/core";
import PrettoSlider from "../../../../styled-components/PrettoSlider";
import FancySwitch from "../../../../styled-components/FancySwitch";
import {
	parseSelectValue,
	TransformObjectToSelectValue,
	channelLabel,
} from "../../../../utils/functions";

const marks = [...Array(7)].map((item, index) => ({ value: index / 2, label: `x${index / 2}` }));

const Leveling = ({ location, guild: userConnectedGuildInfo }) => {
	const [levelUpAnnouncement, setLevelUpAnnouncement] = useState(false);
	const [announcementChannel, setAnnouncementChannel] = useState(false);
	const [levelUpMessage, setLevelUpMessage] = useState(
		"Congrats {player}, you leveled up to level {level}!"
	);
	const { setDashboardOpen, saveOnType } = useContext(DiscordContext);
	const guildId = userConnectedGuildInfo?.id;

	const handleTypeSelect = useCallback(
		async e => {
			const guildLevelRef = firebase.db.collection("Leveling").doc(guildId);
			let value = e.target.checked ? 3 : 1;
			setLevelUpAnnouncement(e.target.checked);
			try {
				await guildLevelRef.update({ type: value });
			} catch (err) {
				await guildLevelRef.set({ type: value });
			}
			setDashboardOpen(true);
		},
		[guildId, setDashboardOpen]
	);

	const handleMessageChange = useCallback(
		async e => {
			const guildLevelRef = firebase.db.collection("Leveling").doc(guildId);
			const message = e.target.value;
			setLevelUpMessage(message);
			try {
				await guildLevelRef.update({ message });
			} catch (err) {
				await guildLevelRef.set({ message });
			}
			saveOnType();
		},
		[guildId, saveOnType]
	);

	const handleAnnoucmentSelect = useCallback(
		async e => {
			const guildLevelRef = firebase.db.collection("Leveling").doc(guildId);
			setAnnouncementChannel(e);
			const notifications = parseSelectValue(e);
			console.log(notifications);
			try {
				guildLevelRef.update({ notifications });
			} catch (err) {
				guildLevelRef.set({ notifications });
			}
			setDashboardOpen(true);
		},
		[guildId, setDashboardOpen]
	);

	useEffect(() => {
		(async () => {
			try {
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
							label: channelLabel(channel),
						});
						setLevelUpAnnouncement({
							value: data.type,
							label: ["Disabled", "Current Channel", "Custom Channel"][data.type - 1],
						});
						setLevelUpMessage(data.message);
					}
				}
			} catch (err) {
				console.log(err.message);
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
			</div>
			<hr />
			<div className="plugin-item-subheader flex">
				<span>
					<h2>Leveling Up</h2>
					<h4>
						Whenever a user gains a level, DisStreamBot can send a personalized message.
					</h4>
				</span>
				<Link
					className="leader-board-link"
					to={`/leaderboard/${userConnectedGuildInfo?.id}`}
				>
					Leaderboard
				</Link>
			</div>
			<div className="plugin-item-body">
				<div className="level-settings">
					<div className="channels">
						<div id="announcement-type">
							<h5 className="bold uppercase">Level up announcement</h5>
							<FancySwitch
								checked={levelUpAnnouncement}
								onChange={handleTypeSelect}
								name="enable-message"
							/>
							{/* <StyledSelect
								closeMenuOnSelect
								onChange={handleTypeSelect}
								placeholder="Select Annoucement type"
								value={levelUpAnnouncement}
								options={[
									{ value: 1, label: "Disabled" },
									{ value: 3, label: "Custom Channel" },
								].map(type => type)}
							/> */}
						</div>
						{
							<div id="announcement-channel">
								<h5 className="bold uppercase">ANNOUNCEMENT CHANNEL</h5>
								<StyledSelect
									isDisabled={!levelUpAnnouncement}
									closeMenuOnSelect
									onChange={handleAnnoucmentSelect}
									placeholder="Select Annoucement Channel"
									value={announcementChannel}
									options={userConnectedGuildInfo?.channels
										?.sort((a, b) => a.parent.localeCompare(b.parent))
										?.map(channel => ({
											value: TransformObjectToSelectValue(channel),
											label: channelLabel(channel),
										}))}
								/>
							</div>
						}
					</div>
					<div className="message">
						<h5>LEVEL UP ANNOUNCEMENT MESSAGE</h5>
						<textarea
							disabled={!levelUpAnnouncement}
							value={levelUpMessage}
							onChange={handleMessageChange}
						></textarea>
					</div>
				</div>
			</div>
			<h4 className="plugin-section-title">Other Settings</h4>
			<div className="plugin-section no-flex" style={{ color: "white" }}>
				<div className="scaling-div" style={{ width: "100%" }}>
					<Typography id="scaling-slider" gutterBottom>
						General XP Scaling
					</Typography>
					<PrettoSlider
						defaultValue={1}
						getAriaValueText={value => `${value}xp`}
						aria-labelledby="xp scaling"
						valueLabelDisplay="auto"
						step={0.5}
						min={0}
						max={3}
						marks={marks}
					/>
				</div>
				<hr />

				<h4 className="plugin-section-title">No Rank Items</h4>
				<div className="no-rank-items">
					<div>
						<StyledSelect
							closeMenuOnSelect
							onChange={() => {}}
							placeholder="No XP Roles"
							value={""}
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
					<div>
						<StyledSelect
							closeMenuOnSelect
							onChange={() => {}}
							placeholder="No XP Channels"
							value={""}
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
				</div>
			</div>
		</div>
	);
};

export default memo(Leveling);
