import React, { useEffect, useState, useCallback, useContext } from "react";
import firebase from "../../../../firebase";
import { DiscordContext } from "../../../../contexts/DiscordContext";

const App = ({ location }) => {
	const {
		userDiscordInfo,
		setUserDiscordInfo,
		userConnectedChannels,
		userConnectedGuildInfo,
		setUserConnectedChannels,
		setUserConnectedGuildInfo,
	} = useContext(DiscordContext);
    const guildId = userConnectedGuildInfo?.id;
    const id = firebase.auth.currentUser.uid;

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
				.doc(id)
				.update({
					liveChatId: e?.map(c => c.value) || [],
				});
			await firebase.db
				.collection("Streamers")
				.doc(id)
				.collection("discord")
				.doc("data")
				.update({
					liveChatId: e?.map(c => c.value) || [],
				});
		},
		[id, setUserConnectedGuildInfo]
	);

	return (
		<div>
			<div className="plugin-item-header">
				<span className="title">
					<img src={`${process.env.PUBLIC_URL}/logo.png`} style={{maxWidth: "60px"}} alt="" />
					<h2>DisStreamChat App</h2>
				</span>
			</div>
			<hr />
			<div className="plugin-item-subheader">
				<h2>App Settings</h2>
				<h4>Whenever a message is sent in one of the selected channels it will be sent to the app.</h4>
			</div>
			<div className="plugin-item-body">
				{(
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
				)}
			</div>
		</div>
	);
};

export default React.memo(App);
