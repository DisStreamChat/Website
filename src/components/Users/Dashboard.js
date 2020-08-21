import React, { useEffect, useState, useCallback, useContext } from "react";
import { NavLink, Route, Redirect, Switch } from "react-router-dom";
import firebase from "../../firebase";
import "./Users.scss";
import "./Dashboard.scss";
import Select from "react-select";
import useFetch from "../../hooks/useFetch";
import SmallLoader from "../Shared/SmallLoader";
import A from "../Shared/A";
import useSnapshot from "../../hooks/useSnapshot";

import { colorStyles, guildOption } from "./userUtils";
import SettingBox from "./SettingBox";
import PluginCard from "./PluginCard";
import { AppContext } from "../../contexts/Appcontext";

const Dashboard = props => {
	const [discordInfo, setDiscordInfo] = useState();
	const [selectedGuild, setSelectedGuild] = useState();
	const [selectedChannel, setSelectedChannel] = useState({});
	const [displayGuild, setDisplayGuild] = useState();
	const [defaultSettings, setDefaultSettings] = useState();
	const [levelUpAnnouncement, setLevelUpAnnouncement] = useState();
	const [announcementChannel, setAnnouncementChannel] = useState(false);
    const { currentUser } = useContext(AppContext);
    
    const id = firebase.auth.currentUser.uid;
    const refreshToken = discordInfo?.refreshToken
    useEffect(() => {
        (async () => {
            console.log("refreshing")
            if(!refreshToken) return
            const response = await fetch(`${process.env.REACT_APP_API_URL}/discord/token/refresh?token=${refreshToken}`);
            if(!response.ok) return

            const json = await response.json()
            if(!json) return
            await firebase.db.collection("Streamers").doc(id || " ").collection("discord").doc("data").set(json.userData)
        })()
    }, [refreshToken, id])

	useEffect(() => {
        //hello
		(async () => {
			const settingsRef = await firebase.db.collection("defaults").doc("settings15").get();
			const settingsData = settingsRef.data().settings;
			setDefaultSettings(settingsData);
		})();
	}, []);

	useEffect(() => {
		setDisplayGuild(guildOption(selectedGuild));
	}, [selectedGuild]);


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

	const disconnectAccount = useCallback(async () => {
		disconnect();
		firebase.db.collection("Streamers").doc(id).collection("discord").doc("data").set({});
		setDiscordInfo({});
	}, [id, disconnect]);


    const guilds = discordInfo?.guilds
	useSnapshot(
		firebase.db.collection("Streamers").doc(id).collection("discord").doc("data"),
		async snapshot => {
			const data = snapshot.data();
			if (data) {
				setDiscordInfo(data);
				const id = data.connectedGuild;
				const guildByName = guilds?.find?.(guild => guild.id === id);
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
				firebase.db
					.collection("Streamers")
					.doc(id || " ")
					.update({
						guildId: data.connectedGuild || "",
					});
			}
		},
		[id, guilds]
	);

	useEffect(() => {
		(async () => {
			if (currentUser) {
				setOverlaySettings(currentUser.overlaySettings);
				setAppSettings(currentUser.appSettings);
			}
		})();
    }, [currentUser]);
    
	useEffect(() => {
		(async () => {
			const discord = await firebase.db.collection("Streamers").doc(id).collection("discord").doc("data").get();
			const userData = currentUser;
			const discordData = await discord.data();
			if (discordData && userData) {
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
	}, [currentUser, id, props.history, sendRequest, discordInfo]);

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
				channels:
					e?.map(c => ({
						id: c.value,
						name: c.label.props.children[0].props.children,
						parent: c.label.props.children[1].props.children,
					})) || [],
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

	const [levelUpMessage, setLevelUpMessage] = useState("Congrats {player}, you leveled up to level {level}!");

	const handleTypeSelect = useCallback(
		async e => {
			const guildLevelRef = firebase.db.collection("Leveling").doc(selectedGuild.id);
			setLevelUpAnnouncement(e);
			await guildLevelRef.update({ type: e.value });
		},
		[selectedGuild]
	);

	const handleMessageChange = useCallback(
		async e => {
			const guildLevelRef = firebase.db.collection("Leveling").doc(selectedGuild.id);
			const message = e.target.value;
			setLevelUpMessage(message);
			await guildLevelRef.update({ message });
		},
		[selectedGuild]
	);

	const handleAnnoucmentSelect = useCallback(
		async e => {
			const guildLevelRef = firebase.db.collection("Leveling").doc(selectedGuild.id);
			setAnnouncementChannel(e);
			guildLevelRef.update({ notifications: e.value });
		},
		[selectedGuild]
	);

    const {location} = props
    const guildId = selectedGuild?.id
	useEffect(() => {
		(async () => {
            if(location.pathname.includes("/leveling")){
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
            }
			
		})();
	}, [location, guildId]);

	const [prefix, setPrefix] = useState("!");
	const [activePlugins, setActivePlugins] = useState({});

	useEffect(() => {
		(async () => {
			const guild = await firebase.db
				.collection("DiscordSettings")
				.doc(selectedGuild?.id || " ")
				.get();
			const data = guild.data();
			if (data) {
				setPrefix(data.prefix || "!");
				setActivePlugins(data.activePlugins);
			} else {
				setPrefix("!");
			}
		})();
	}, [selectedGuild]);

	const prefixChange = useCallback(
		async e => {
			setPrefix(e.target.value);
			firebase.db
				.collection("DiscordSettings")
				.doc(selectedGuild?.id || " ")
				.update({
					prefix: e.target.value,
				});
		},
		[selectedGuild?.id]
	);

	return (
		<div className="settings-container">
			<div className="setting-options">
				<NavLink className="setting-link" activeClassName="active" to={`${props.match.url}/appsettings`}>
					App Settings
				</NavLink>
				{/* <NavLink className="setting-link" activeClassName="active" to={`${props.match.url}/overlaysettings`}>
					overlay Settings
				</NavLink> */}
				<NavLink className="setting-link" activeClassName="active" to={`${props.match.url}/discord`}>
					Discord Settings
				</NavLink>
                <NavLink className="setting-link" activeClassName="active" to={`${props.match.url}/account`}>
					Account Settings
				</NavLink>
			</div>
			<div className="settings">
				<Switch>
                <Route path={`${props.match.url}/account`}></Route>
					<Route path={`${props.match.url}/discord`}>
						<h1>Discord Settings</h1>
						<h3>
							Connect your discord account to DisStreamChat to get discord messages in your client/overlay during stream. You can only
							connect one server at a time but you can connect as many channels in that server
						</h3>
						<hr />
						<div className="settings-body">
							{Object.keys(discordInfo || {}).length ? (
								<>
									<div className="discord-header">
										<Select
											value={displayGuild}
											onChange={onGuildSelect}
											placeholder="Select Guild"
											options={discordInfo?.guilds
												?.filter(guild => guild.permissions.includes("MANAGE_GUILD"))
												.map(guildOption)}
											styles={colorStyles}
											isDisabled={!!discordInfo.connectedGuild}
										/>
										<span>
											<img className="discord-profile" src={discordInfo?.profilePicture} alt="" />
											<span className="discord-name">{discordInfo?.name}</span>
										</span>
									</div>
									<div className="discord-body">
										{isLoading ? (
											<SmallLoader />
										) : selectedGuild ? (
											<>
												{!selectedGuild.isMember ? (
													<div className="not-member">
														<span className="error-color">DisStreamBot is not a member of this server</span>
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
																	value={selectedChannel.channels
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
																	options={selectedGuild.channels
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
																<button
																	onClick={disconnect}
																	className="discord-settings-button ml-0 mt-1 warning-button"
																>
																	Disconnect Guild
																</button>
															</>
														) : (
															<>
																<span>This guild is not connected to the bot</span>
																<button onClick={Connectguild} className="discord-settings-button warning-button">
																	Connect it
																</button>
															</>
														)}
													</>
												)}
											</>
										) : (
											<button onClick={disconnectAccount} className="discord-settings-button ml-0 mt-1 warning-button">
												Disconnect Account
											</button>
										)}
										<hr />
										{selectedGuild?.id === selectedChannel?.guild && (
											<div className="discord-prefix">
												<label htmlFor="discord-prefix">
													<h2 className="prefix-header">Command Prefix</h2>
													<h3 className="prefix-subheader">
														Set the prefix used to run DisStreamBot commands in this discord server
													</h3>
												</label>
												<div className="prefix-body">
													<input
														value={prefix}
														onChange={prefixChange}
														type="text"
														className="prefix-input"
														id="discord-prefix"
													/>
												</div>
											</div>
										)}
										<hr />
										{selectedGuild?.id === selectedChannel?.guild ? (
											<div className="plugins">
												<Switch>
													<Route exact path={`${props.match.url}/discord`}>
														<div className="plugin-header">
															<h2>Plugins</h2>
															<h3>
																Add extra functionality to the bot in your server with plugins like leveling, custom
																commands, and logging
															</h3>
														</div>

														<div className="plugin-list">
															<A href={activePlugins["leveling"] ? `${props.match.url}/discord/leveling` : null} local>
																<PluginCard
																	active={activePlugins["leveling"]}
																	title="Leveling"
																	image={`${process.env.PUBLIC_URL}/trophy.svg`}
																	description="Let your users gain XP and levels by participating in the chat!"
																/>
															</A>
															<PluginCard
																title="Custom Commands"
																image={`${process.env.PUBLIC_URL}/discord.png`}
																description="Add awesome custom commands to your server"
																comingSoon
															/>
															<PluginCard
																title="Logging"
																image={`${process.env.PUBLIC_URL}/clipboard.svg`}
																description="Don't miss anything happening in your server when you are not around!"
																comingSoon
															/>
                                                            <PluginCard
																title="Welcome"
																image={``}
																description="Give new users a warm welcome"
																comingSoon
															/>
                                                            <PluginCard
																title="Help"
																image={``}
																description="Enables the 'help' command in your server"
																comingSoon
															/>
														</div>
													</Route>
													{activePlugins["leveling"] && (
														<Route path={`${props.match.url}/discord/leveling`}>
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
																					.doc(selectedGuild?.id || " ")
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
																					options={selectedGuild?.channels
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
														</Route>
													)}
													<Redirect to={`${props.match.url}/discord`} />
												</Switch>
											</div>
										) : (
											<Redirect to={`${props.match.url}/discord`} />
										)}
									</div>
								</>
							) : (
								<>
									You have not Connected your Discord Account
									<A
										newTab
										href={`https://discord.com/api/oauth2/authorize?client_id=702929032601403482&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}%2F%3Fdiscord%3Dtrue&response_type=code&scope=identify%20guilds`}
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
