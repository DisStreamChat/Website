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
import InfoTwoToneIcon from "@material-ui/icons/InfoTwoTone";
import { Tooltip } from "@material-ui/core";
import StyledSelect from "../../../../styled-components/StyledSelect";
import {
	channelLabel,
	parseSelectValue,
	TransformObjectToSelectValue,
} from "../../../../utils/functions";

const WelcomeMessage = ({ guild }) => {
	const { saveOnType, setDashboardOpen } = useContext(DiscordContext);
	const guildId = guild?.id || " ";
	const [welcomeChannel, setWelcomeChannel] = useState("");
	const [welcomeMessage, setWelcomeMessage] = useState("");

	useEffect(() => {
		(async () => {
			const DiscordSettings = (
				await firebase.db.collection("DiscordSettings").doc(guildId).get()
			).data();
			if (DiscordSettings) {
				const WelcomeMessageData = DiscordSettings.welcomeMessage;
				const channel = guild?.channels?.find(
					channel => channel?.id === WelcomeMessageData.channel
				);
				if (channel) {
					setWelcomeChannel({
						value: TransformObjectToSelectValue(channel),
						label: channelLabel(channel),
					});
				}
				setWelcomeMessage(WelcomeMessageData.message);
				console.log(WelcomeMessageData);
			}
		})();
	}, [guildId, guild]);

	const handleMessageChange = async e => {
		setWelcomeMessage(e.target.value);
		const docRef = firebase.db.collection("DiscordSettings").doc(guildId);
		try {
			await docRef.update({ welcomeMessage: { message: e.target.value } }, { merge: true });
		} catch (err) {
			await docRef.set({ welcomeMessage: { message: e.target.value } }, { merge: true });
		}
		saveOnType();
	};

	const handleChannelChange = async e => {
		setWelcomeChannel(e);
		const channel = parseSelectValue(e);
		const docRef = firebase.db.collection("DiscordSettings").doc(guildId);
		try {
			await docRef.update({ welcomeMessage: { channel: channel } }, { merge: true });
		} catch (err) {
			await docRef.set({ welcomeMessage: { channel: channel } }, { merge: true });
		}
		setDashboardOpen(true);
	};

	return (
		<div>
			<div className="plugin-item-header">
				<span className="title">
					<img src={`${process.env.PUBLIC_URL}/wave.svg`} alt="" />
					<h2>Welcome Message</h2>
				</span>
			</div>
			<hr />
			<div className="plugin-item-subheader flex">
				<span>
					<h4>
						Whenever a user joins your server, DisStreamBot can send a personalized
						message.
					</h4>
				</span>
			</div>
			<div className="plugin-section">
				<div className="welcome-channel">
					<h4 className="plugin-section-title">Welcome Message Channel</h4>
					<StyledSelect
						isClearable
						closeMenuOnSelect
						onChange={handleChannelChange}
						placeholder="Select Welcome Message Channel"
						value={welcomeChannel}
						options={guild?.channels
							?.sort((a, b) => a.parent.localeCompare(b.parent))
							?.map(channel => ({
								value: TransformObjectToSelectValue(channel),
								label: channelLabel(channel),
							}))}
					/>
				</div>
				<div className="welcome-message message">
					<h4 className="plugin-section-title">Welcome Message</h4>
					<textarea
						placeholder="Welcome to our server {member}!"
						value={welcomeMessage}
						onChange={handleMessageChange}
					></textarea>
				</div>
			</div>
		</div>
	);
};

export default WelcomeMessage;
