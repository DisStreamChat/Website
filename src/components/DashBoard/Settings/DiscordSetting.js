import React, { useState, useCallback, useEffect, useContext } from "react";
import { ChromePicker } from "react-color";
import { Switch } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { blueGrey } from "@material-ui/core/colors";
import AddIcon from "@material-ui/icons/Add";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Button from "@material-ui/core/Button";
import chroma from "chroma-js";
import InputSlider from "../../Shared/InputSlider";
import lodash from "lodash";
import uid from "uid";
import Select from "react-select";
import AnimateHeight from "react-animate-height";
import { colorStyles, guildOption } from "../../Shared/userUtils";
import firebase from "../../../firebase";
import { DiscordContext } from "../../../contexts/DiscordContext";
import styled from "styled-components";
import { useMemo } from "react";
import { useAsyncMemo } from "use-async-memo";

const SettingBody = styled.div`
	padding: 1rem;
`;

const DiscordSetting = props => {
	const { userDiscordInfo, setUserConnectedGuildInfo } = useContext(DiscordContext);

	const [connectedGuild, setConnectedGuild] = useState();

	const id = firebase.auth.currentUser.uid;

	useEffect(() => {
		(async () => {
			const discordData = (await firebase.db.collection("Streamers").doc(id).collection("discord").doc("data").get()).data();
			const guildId = discordData.connectedGuild;
			const guild = discordData?.guilds?.find?.(guild => guild.id === guildId);
			const response = await fetch(`${process.env.REACT_APP_API_URL}/getchannels?new=true&guild=` + guildId);
			const memberResponse = await fetch(`${process.env.REACT_APP_API_URL}/ismember?guild=` + guildId);
			const json = await response.json();
			const memberJson = await memberResponse.json();
			const roles = json.roles;
			const channels = json.channels;
			const userData = (await firebase.db.collection("Streamers").doc(id).get()).data();
			setConnectedGuild({
				...guild,
				roles,
				channels,
				isMember: memberJson?.result,
				connectedChannels: channels?.filter(channel => userData.liveChatId?.includes(channel.id)),
			});
		})();
	}, [id]);

	const onGuildSelect = async ({ value, label }) => {
		const selectedGuild = userDiscordInfo?.guilds?.find(guild => guild.name === value);
		const guildId = selectedGuild.id;
		const response = await fetch(`${process.env.REACT_APP_API_URL}/getchannels?new=true&guild=` + guildId);
		const memberResponse = await fetch(`${process.env.REACT_APP_API_URL}/ismember?guild=` + guildId);
		const json = await response.json();
		const memberJson = await memberResponse.json();
		const roles = json.roles;
		const channels = json.channels;
		const userData = (await firebase.db.collection("Streamers").doc(id).get()).data();
		setConnectedGuild({
			...selectedGuild,
			roles,
			channels,
			isMember: memberJson?.result,
			connectedChannels: channels?.filter(channel => userData.liveChatId?.includes(channel.id)),
		});
		await firebase.db.collection("Streamers").doc(id).collection("discord").doc("data").update({ connectedGuild: guildId });
	};

	const AvailableServers = useAsyncMemo(async () => {
		const allServers = userDiscordInfo?.guilds?.filter(guild => guild.permissions.includes("MANAGE_GUILD"));
		const results = await Promise.all(
			allServers?.map(async guild => {
				const memberResponse = await fetch(`${process.env.REACT_APP_API_URL}/ismember?guild=` + guild.id);
				const memberJson = await memberResponse.json();
				return memberJson?.result;
			}) || []
		);
		return (
			allServers?.filter((guild, i) => {
				return results[i];
			}) || []
		);
	}, [userDiscordInfo]);

	const onChannelSelect = useCallback(
		async e => {
            console.log(e)
			setConnectedGuild(s => ({
				...s,
				connectedChannels:
					e?.map(c => ({
						id: c.value.split(":")[1],
						name: c.label.props.children[0].props.children,
						parent: c.label.props.children[1].props.children,
					})) || [],
			}));
			await firebase.db
				.collection("Streamers")
				.doc(id)
				.update({
					liveChatId: e?.map(c => c.value.split(":")[1]) || [],
				});
			await firebase.db
				.collection("Streamers")
				.doc(id)
				.collection("discord")
				.doc("data")
				.update({
					liveChatId: e?.map(c => c.value.split(":")[1]) || [],
				});
		},
		[id]
	);

	return (
		<>
			<span className="color-header flex" onClick={() => props.onClick(props.name)}>
				<span>
					<KeyboardArrowDownIcon className={`${props.open ? "open" : "closed"} mr-quarter`} />
					<h3>{"Disord Connection"}</h3>
				</span>
			</span>
			<AnimateHeight duration={250} height={!props.open ? 0 : 500}>
				<SettingBody className="plugin-item-body">
					<AnimateHeight>
						<h3>select Server to listen to</h3>
						<Select
							onChange={onGuildSelect}
							placeholder="Select Connected Server"
							value={guildOption(connectedGuild)}
							options={AvailableServers?.map(guildOption)}
							styles={{
								...colorStyles,
								container: styles => ({ ...styles, ...colorStyles.container }),
							}}
						/>
						{connectedGuild && (
							<>
								<h3>select Channels to listen to in {connectedGuild?.name}</h3>
								<Select
									closeMenuOnSelect={false}
									isMulti
									onChange={onChannelSelect}
									placeholder="Select Channels"
									value={connectedGuild.connectedChannels
										?.sort((a, b) => a.parent.localeCompare(b.parent))
										?.map(channel => ({
											value: `${channel.name}:${channel.id}`,
											label: (
												<>
													<span>{channel.name}</span>
													<span className="channel-category">{channel.parent}</span>
												</>
											),
										}))}
									options={connectedGuild?.channels
										?.sort((a, b) => a.parent.localeCompare(b.parent))
										?.map(channel => ({
											value: `${channel.name}:${channel.id}`,
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
								/>
							</>
						)}
					</AnimateHeight>
				</SettingBody>
			</AnimateHeight>
		</>
	);
};

export default DiscordSetting;
