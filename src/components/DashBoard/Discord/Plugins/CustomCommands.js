import React, { useEffect, useState, useCallback, useContext } from "react";
import firebase from "../../../../firebase";
import { DiscordContext } from "../../../../contexts/DiscordContext";
import Modal from "react-modal";
import ClearIcon from "@material-ui/icons/Clear";

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
				<div className="command-header">
					<h1>Create Command</h1>
					<button onClick={() => setCreatingCommand(false)}>
						<ClearIcon />
					</button>
				</div>
				<div className="command-body">
					<h4 className="plugin-section-title">Command Name</h4>
					<div className="plugin-section">
						<input placeholder="Command Name (Don't include prefix)" type="text" className="prefix-input" id="discord-prefix" />
					</div>
					<h4 className="plugin-section-title">Command Response</h4>
					<div className="plugin-section">
						<textarea placeholder="Hi, {user}!" rows="8" className="message"></textarea>
						<div className="variables">
							<h4 className="plugin-section-title">Available variables</h4>
							<ul>
								<li className="variable">{"{author} - The user who sent the command"}</li>
							</ul>
						</div>
					</div>
				</div>
				<div className="command-footer"></div>
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
					<div className="create-command" onClick={() => setCreatingCommand(true)}>
						<h1>Text Command</h1>
						<p>A simple command that responds with a custom message in DM or public</p>
					</div>
					<div className="create-command" onClick={() => setCreatingCommand(true)}>
						<h1>Auto Role</h1>
						<p>A simple command that responds with a custom message in DM or public</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default React.memo(CustomCommands);
