import React, { useEffect, useState, useCallback } from "react";
import { NavLink, Route, Redirect, Switch, useParams } from "react-router-dom";
import firebase from "../../firebase";
import "./Users.scss";
import Select from "react-select";
import Setting from "./Setting";
import useFetch from "../../hooks/useFetch";
import SmallLoader from "../Shared/SmallLoader";
import A from "../Shared/A";
import useSnapshot from "../../hooks/useSnapshot";

import { colorStyles, guildOption } from "./userUtils";
import SettingBox from "./SettingBox";

const Dashboard = props => {
	const [discordInfo, setDiscordInfo] = useState();
	const [selectedGuild, setSelectedGuild] = useState();
	const [selectedChannel, setSelectedChannel] = useState({});
	const [displayGuild, setDisplayGuild] = useState();
	const [defaultSettings, setDefaultSettings] = useState();

	useEffect(() => {
		(async () => {
			const settingsRef = await firebase.db.collection("defaults").doc("settings").get();
			const settingsData = settingsRef.data().settings;
			setDefaultSettings(settingsData);
		})();
	}, []);

	useEffect(() => {
		setDisplayGuild(guildOption(selectedGuild));
	}, [selectedGuild]);

	const currentUser = firebase.auth.currentUser;
	const id = currentUser.uid;

	const [overlaySettings, setOverlaySettings] = useState();
	const [appSettings, setAppSettings] = useState();

	const { sendRequest } = useFetch();
	const { isLoading, sendRequest: sendLoadingRequest } = useFetch();

	const updateAppSetting = useCallback(
		async (name, value) => {
			const copy = { ...appSettings };
			copy[name] = value;
			setAppSettings(copy);
			const userRef = firebase.db.collection("Streamers").doc(id);
			await userRef.update({
				appSettings: copy,
			});
		},
		[appSettings, id]
	);

	const updateOverlaySetting = useCallback(
		async (name, value) => {
			const copy = { ...overlaySettings };
			copy[name] = value;
			setOverlaySettings(copy);
			const userRef = firebase.db.collection("Streamers").doc(id);
			await userRef.update({
				overlaySettings: copy,
			});
		},
		[overlaySettings, id]
	);

	const disconnect = useCallback(async () => {
		setSelectedGuild(null);
		firebase.db.collection("Streamers").doc(id).collection("discord").doc("data").update({
			connectedGuild: "",
		});
		firebase.db.collection("Streamers").doc(id).update({
			liveChatId: [],
		});
	}, [id]);

	useSnapshot(
		firebase.db.collection("Streamers").doc(id).collection("discord").doc("data"),
		snapshot => {
			const data = snapshot.data();
			if (data) {
				firebase.db
					.collection("Streamers")
					.doc(id)
					.update({
						guildId: data.connectedGuild || "",
					});
			}
		},
		[id]
	);

	useSnapshot(
		firebase.db.collection("Streamers").doc(id).collection("discord").doc("data"),
		async snapshot => {
			const data = snapshot.data();
			if (data) {
				const id = data.connectedGuild;
				const guildByName = discordInfo?.guilds?.find?.(guild => guild.id === id);
				if (guildByName) {
					const guildId = guildByName.id;
					const value = await sendRequest(`${process.env.REACT_APP_API_URL}/ismember?guild=` + guildId);
					const channelReponse = await sendRequest(`${process.env.REACT_APP_API_URL}/getchannels?guild=` + guildId);
					setSelectedGuild({
						name: guildByName.name,
						isMember: value?.result,
						icon: guildByName.icon,
						id: guildByName.id,
						channels: channelReponse,
					});
				}
			}
		},
		[discordInfo, id, sendRequest]
	);

	useEffect(() => {
		(async () => {
			const userRef = await firebase.db.collection("Streamers").doc(id).get();
			const userData = userRef.data();

			if (userData) {
				setOverlaySettings(userData.overlaySettings);
				setAppSettings(userData.appSettings);
			}
		})();
	}, []);

	useSnapshot(
		firebase.db.collection("Streamers").doc(id).collection("discord").doc("data"),
		snapshot => {
			setDiscordInfo(snapshot.data());
		},
		[id]
	);

	useEffect(() => {
		(async () => {
			const user = await firebase.db.collection("Streamers").doc(id).get();
			const discord = await firebase.db.collection("Streamers").doc(id).collection("discord").doc("data").get();
			const userData = await user.data();
			const discordData = await discord.data();
			if (discordData) {
				const channels = userData.liveChatId;
				const channelData = channels instanceof Array ? channels : [channels];
				const resolveChannel = async channel =>
					sendRequest(`${process.env.REACT_APP_API_URL}/resolvechannel?guild=${discordData.connectedGuild}&channel=${channel}`);
				setSelectedChannel({
					guild: discordData.connectedGuild,
					channels: (await Promise.all(channelData.map(resolveChannel))).filter(c => !!c),
				});
			}
		})();
	}, [id, props.history, sendRequest, discordInfo]);

	const Connectguild = useCallback(async () => {
		firebase.db.collection("Streamers").doc(id).collection("discord").doc("data").update({
			connectedGuild: selectedGuild.id,
		});
	}, [selectedGuild, id]);

	const onGuildSelect = useCallback(
		async e => {
			const name = e.value;
			const guildByName = discordInfo.guilds.filter(guild => guild.name === name)[0];
			const guildId = guildByName.id;
			const { result: isMember } = await sendLoadingRequest(`${process.env.REACT_APP_API_URL}/ismember?guild=` + guildId);
			const channelReponse = await sendLoadingRequest(`${process.env.REACT_APP_API_URL}/getchannels?guild=` + guildId);

			setSelectedGuild({
				name,
				isMember,
				icon: guildByName.icon,
				id: guildByName.id,
				channels: channelReponse,
			});
		},
		[discordInfo, sendLoadingRequest]
	);

	const onChannelSelect = useCallback(
		async e => {
			setSelectedChannel(s => ({
				...s,
				channels: e?.map(c => ({ id: c.value, name: c.label.props.children[0].props.children, parent: c.label.props.children[1].props.children })) || [],
			}));
			firebase.db
				.collection("Streamers")
				.doc(id)
				.update({
					liveChatId: e?.map(c => c.value) || [],
				});
		},
		[id]
	);

	return (
		<div className="settings-container">
			<div className="setting-options">
				<NavLink className="setting-link" activeClassName="active" to={`${props.match.url}/appsettings`}>
					App Settings
				</NavLink>
				<NavLink className="setting-link" activeClassName="active" to={`${props.match.url}/overlaysettings`}>
					overlay Settings
				</NavLink>
				<NavLink className="setting-link" activeClassName="active" to={`${props.match.url}/discord`}>
					Discord Connect
				</NavLink>
			</div>
			<div className="settings">
				<Switch>
					<Route path={`${props.match.url}/discord`}>
						<h1>Discord Connect</h1>
						<h3>
							Connect your discord account to DisTwitchChat to get discord messages in your client/overlay during stream. You can only
							connect one server at a time but you can connect as many channels in that server
						</h3>
						<hr />
						<div className="settings-body">
							{discordInfo ? (
								<>
									<div className="discord-header">
										<Select
											value={displayGuild}
											onChange={onGuildSelect}
											placeholder="Select Guild"
											options={discordInfo.guilds.filter(guild => guild.permissions.includes("MANAGE_GUILD")).map(guildOption)}
											styles={colorStyles}
											isDisabled={!!discordInfo.connectedGuild}
										/>
										<span>
											<img className="discord-profile" src={discordInfo.profilePicture} alt="" />
											<span className="discord-name">{discordInfo.name}</span>
										</span>
									</div>
									<div className="discord-body">
										{isLoading ? (
											<SmallLoader />
										) : (
											selectedGuild && (
												<>
													{!selectedGuild.isMember ? (
														<div className="not-member">
															<span className="error-color">DisTwitchBot is not a member of this server</span>
															<a
																href={`https://discord.com/api/oauth2/authorize?client_id=702929032601403482&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F%3Fdiscord%3Dtrue&scope=bot&guild_id=${selectedGuild?.id}`}
															>
																<button className="invite-link discord-settings-button">Invite it</button>
															</a>
														</div>
													) : (
														<>
															{selectedGuild.id === selectedChannel.guild ? (
																<>
																	<h3>select channels to listen to</h3>
																	<Select
																		closeMenuOnSelect={false}
																		onChange={onChannelSelect}
																		placeholder="Select Channel"
																		value={selectedChannel.channels.sort((a, b) => a.parent.localeCompare(b.parent)).map(channel => ({
																			value: channel.id,
																			label: (
																				<>
																					<span>{channel.name}</span>
																					<span className="channel-category">{channel.parent}</span>
																				</>
																			),
																		}))}
																		options={selectedGuild.channels.sort((a, b) => a.parent.localeCompare(b.parent)).map(channel => ({
																			value: channel.id,
																			label: (
																				<>
																					<span>{channel.name}</span>
																					<span className="channel-category">{channel.parent}</span>
																				</>
																			),
																		}))}
																		styles={{...colorStyles, container: styles => ({...styles, ...colorStyles.container})}}
																		isMulti
																	/>
																	<button
																		onClick={disconnect}
																		className="discord-settings-button ml-0 mt-1 warning-button"
																	>
																		Disconnect
																	</button>
																</>
															) : (
																<>
																	<span>This channel is not connected to your account</span>
																	<button onClick={Connectguild} className="discord-settings-button warning-button">
																		Connect it
																	</button>
																</>
															)}
														</>
													)}
												</>
											)
										)}
									</div>
								</>
							) : (
								<>
									You have not Connected your Discord Account
									<A
										newTab
										href="https://discord.com/api/oauth2/authorize?client_id=702929032601403482&redirect_uri=https%3A%2F%2Fwww.distwitchchat.com%2F%3Fdiscord%3Dtrue&response_type=code&scope=identify%20guilds"
									>
										<button className="discord-settings-button good-button">Connect It</button>
									</A>
									{/* You have not Connected your Discord Account<A newTab href="https://discord.com/api/oauth2/authorize?client_id=702929032601403482&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F%3Fdiscord%3Dtrue&response_type=code&scope=identify%20connections"><button className="discord-settings-button good-button">Connect It</button></A> */}
								</>
							)}
						</div>
					</Route>
					<Route path={`${props.match.url}/overlaysettings`}>
						<SettingBox
							title="Overlay Settings"
							subtitle={
								<>
									Adjust the settings of your overlay. if you don't use the overlay but want to you can start using it{" "}
									<A className="ul bld" href="/apps" newTab local>
										here
									</A>
								</>
							}
							path="overlaysettings"
							parenturl={props.match.url}
							defaultSettings={defaultSettings}
							settings={overlaySettings}
							updateSettings={updateOverlaySetting}
						/>
					</Route>
					<Route path={`${props.match.url}/appsettings`}>
						<SettingBox
							title="App Settings"
							subtitle={
								<>
									Adjust the settings of your app. if you don't use the app but want to you can start using it{" "}
									<A className="ul bld" href="/apps" newTab local>
										here
									</A>
								</>
							}
							path="appsettings"
							parenturl={props.match.url}
							defaultSettings={defaultSettings}
							settings={appSettings}
							updateSettings={updateAppSetting}
							app
						/>
					</Route>
					<Redirect to={`${props.match.url}/appsettings`} />
				</Switch>
			</div>
		</div>
	);
};

export default Dashboard;
