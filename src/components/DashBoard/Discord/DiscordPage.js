import { memo, useEffect, useState, useCallback, useContext } from "react";
import { withRouter, useParams } from "react-router-dom";
import firebase from "../../../firebase";
import A from "../../Shared/A";
import useSnapshot from "../../../hooks/useSnapshot";
import { guildOption } from "../../../utils/functions";
import { AppContext } from "../../../contexts/Appcontext";
import { DiscordContext } from "../../../contexts/DiscordContext";
import PluginHome from "./Plugins/PluginHome";
import StyledSelect from "../../../styled-components/StyledSelect";



const DiscordPage = memo(({ history, match }) => {
	const [displayGuild, setDisplayGuild] = useState();
	const [refreshed, setRefreshed] = useState(false);
	const { id: guildId } = useParams();
	const { userDiscordInfo, userConnectedGuildInfo, setUserConnectedGuildInfo } = useContext(DiscordContext);
	const [connectedGuild, setConnectedGuild] = useState();
	const { userId } = useContext(AppContext);
	const guilds = userDiscordInfo?.guilds

	useEffect(() => {
		(async () => {
			const guild = guilds?.find?.(guild => guild.id === guildId);
			if (guild) {
				const response = await fetch(`${process.env.REACT_APP_API_URL}/getchannels?new=true&guild=` + guildId);
				const memberResponse = await fetch(`${process.env.REACT_APP_API_URL}/ismember?guild=` + guildId);
				const json = await response.json();
				const memberJson = await memberResponse.json();
				const roles = json.roles;
				const channels = json.channels;
				const userData = (await firebase.db.collection("Streamers").doc(userId).get()).data();
				setConnectedGuild({ ...guild, roles, channels, isMember: memberJson?.result });
				setUserConnectedGuildInfo({
					...guild,
					roles,
					channels,
					isMember: memberJson?.result,
					connectedChannels: channels?.filter(channel => userData.liveChatId?.includes(channel.id)),
				});
			}
		})();
	}, [guildId, setUserConnectedGuildInfo, guilds, userId]);

	useEffect(() => {
		(async () => {
			const guild = userDiscordInfo?.guilds?.find?.(guild => guild.id === guildId);
			if (guild) {
				setDisplayGuild(guildOption(guild));
			}
		})();
	}, [userDiscordInfo, guildId]);

	const refreshToken = userDiscordInfo?.refreshToken;
	useEffect(() => {
		(async () => {
			if (!refreshToken || !userId) return;
			if (refreshed) return console.log("already refreshed");
			console.log("refreshing");
			const otcData = (await firebase.db.collection("Secret").doc(userId).get()).data();
			const otc = otcData?.value;
			setRefreshed(true);
			const response = await fetch(`${process.env.REACT_APP_API_URL}/discord/token/refresh?token=${refreshToken}&id=${userId}&otc=${otc}`);
			if (!response.ok) return;

			const json = await response.json();

			if (!json) return;
			await firebase.db
				.collection("Streamers")
				.doc(userId || " ")
				.collection("discord")
				.doc("data")
				.update(json.userData);
		})();
	}, [userId, refreshed, refreshToken]);

	useSnapshot(
		firebase.db
			.collection("Streamers")
			.doc(userId || " ")
			.collection("discord")
			.doc("data"),
		async snapshot => {
			const data = snapshot.data();
			if (data) {
				firebase.db
					.collection("Streamers")
					.doc(userId || " ")
					.update({
						guildId: data.connectedGuild || "",
					});
			}
		},
		[userId]
	);

	const onGuildSelect = useCallback(
		async e => {
			const name = e.value;
			const guildByName = guilds?.find(guild => guild.name === name);
			const selectedGuildId = guildByName.id;
			try {
				if (guildId) {
					const path = match.url.split("/");
					if (path.length > 3) {
						history.push(`${path.slice(0, 3).join("/")}/${selectedGuildId}`);
					} else {
						history.push(`${selectedGuildId}`);
					}
				} else {
					history.push(`${match.url}/${selectedGuildId}`);
				}
			} catch (err) {}
		},
		[guilds, guildId, match.url, history]
	);

	return (
		<div>
			<h1>Discord Settings</h1>
			<h3>
				Connect your discord account to DisStreamChat to get discord messages in your client/overlay during stream. You can only connect one
				server at a time but you can connect as many channels in that server
			</h3>
			<hr />
			<div className="settings-body">
				{Object.keys(userDiscordInfo || {}).length ? (
					<>
						<div className="plugin-section-title" style={{paddingLeft: ".5rem"}}>Server</div>
						<div className="discord-header">
							<StyledSelect
								value={displayGuild}
								onChange={onGuildSelect}
								placeholder="Select Server"
								options={userDiscordInfo?.guilds?.filter(guild => guild.permissions.includes("MANAGE_GUILD")).map(guildOption)}
							/>
						</div>
						<div className="discord-body">
							{userConnectedGuildInfo ? (
								!userConnectedGuildInfo.isMember ? (
									<div className="not-member">
										<span className="error-color">DisStreamBot is not a member of this server</span>
										<A
											href={`https://discord.com/api/oauth2/authorize?client_id=702929032601403482&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F%3Fdiscord%3Dtrue&scope=bot&guild_id=${userConnectedGuildInfo?.id}`}
										>
											<button className="invite-link discord-settings-button">Invite it</button>
										</A>
									</div>
								) : guildId ? (
									<PluginHome connectedGuild={connectedGuild} guildId={guildId} match={match} />
								) : (
									<></>
								)
							) : (
								<PluginHome connectedGuild={connectedGuild} guildId={guildId} match={match} blank />
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
		</div>
	);
});

export default withRouter(memo(DiscordPage));
