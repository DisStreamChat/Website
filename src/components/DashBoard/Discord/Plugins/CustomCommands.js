import React, { useEffect, useState, useCallback, useContext } from "react";
import firebase from "../../../../firebase";
import { DiscordContext } from "../../../../contexts/DiscordContext";
import Modal from "react-modal";
import CreateTextCommand from "./CreateTextCommand";
import CreateRoleCommand from "./CreateRoleCommand";
import CreateCommand from "./CreateCommand";
import { CommandContextProvider } from "../../../../contexts/CommandContext";

const CustomCommands = ({ location }) => {
	const [loggingChannel, setLoggingChannel] = useState("");
	const [activeEvents, setActiveEvents] = useState({});
	const [allEvents, setAllEvents] = useState({});
	const [creatingCommand, setCreatingCommand] = useState(false);
	const { setActivePlugins, userConnectedGuildInfo } = useContext(DiscordContext);
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

	useEffect(() => {
		document.body.style.overflow = creatingCommand ? "hidden" : "initial";
		return () => {
			document.body.style.overflow = "initial";
		};
	}, [creatingCommand]);

	return (
		<div>
			<Modal
				isOpen={creatingCommand}
				className="command-modal Modal"
				overlayClassName="command-overlay Modal-Overlay"
				onRequestClose={() => setCreatingCommand(false)}
			>
				<CommandContextProvider>
					<CreateCommand role={creatingCommand === "role"} setCreatingCommand={setCreatingCommand}>
						{creatingCommand === "text" ? <CreateTextCommand /> : <CreateRoleCommand />}
					</CreateCommand>
				</CommandContextProvider>
			</Modal>
			<div className="plugin-item-header">
				<span className="title">
					<img src={`${process.env.PUBLIC_URL}/aprove.png`} alt="" />
					<h2>Custom Commands</h2>
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
			{/* <div className="plugin-item-subheader">
				<h4>
					You can set a channel and events that will be sent to that particular channel. Don't miss anything happening in your server when
					you are not around!
				</h4>
			</div> */}
			<div className="plugin-item-body">
				<h4 className="plugin-section-title">Create Command</h4>
				<div className="command-card-body">
					<div className="create-command" onClick={() => setCreatingCommand("text")}>
						<h1>Text Command</h1>
						<p>A simple command that responds with a custom message in DM or public</p>
					</div>
					<div className="create-command" onClick={() => setCreatingCommand("role")}>
						<h1>Role Command</h1>
						<p>A simple command that toggles a role for the user</p>
					</div>
				</div>
				<h4 className="plugin-section-title bigger">
					Your Commands<span> — {5}</span>
				</h4>
			</div>
		</div>
	);
};

export default React.memo(CustomCommands);
