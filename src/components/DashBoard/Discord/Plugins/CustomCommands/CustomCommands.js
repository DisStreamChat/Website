import { memo, useEffect, useState, useContext } from "react";
import firebase from "../../../../../firebase";
import Modal from "react-modal";
import CreateTextCommand from "./CreateTextCommand";
import CreateRoleCommand from "./CreateRoleCommand";
import CreateCommand from "./CreateCommand";
import CommandItem from "./CommandItem";
import { CommandContext } from "../../../../../contexts/CommandContext";

const CustomCommands = ({ location, guild: userConnectedGuildInfo }) => {
	const [creatingCommand, setCreatingCommand] = useState(false);
	const [commands, setCommands] = useState({});
	const guildId = userConnectedGuildInfo?.id;
	const {
		setName,
		setResponse,
		setRoleToGive,
		setDescription,
		setAllowedRoles,
		setBannedRoles,
		setAllowedChannels,
		setCooldown,
		setDeleteUsage,
		setError,
		setEditing,
	} = useContext(CommandContext);

	useEffect(() => {
		const unsub = firebase.db
			.collection("customCommands")
			.doc(guildId || " ")
			.onSnapshot(snapshot => {
				const data = snapshot.data();
				if (data) {
					setCommands(data);
				}
			});
		return unsub;
	}, [location, guildId]);

	const setupCommand = () => {
	    console.log(setName)
		setName("");
		setResponse("");
		setRoleToGive("");
		setDescription("");
		setAllowedRoles([]);
		setBannedRoles([]);
		setAllowedChannels([]);
		setCooldown(0);
		setDeleteUsage(false);
		setError({});
		setEditing(false);
	};

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
				<CreateCommand guild={userConnectedGuildInfo}  role={creatingCommand === "role"} setCreatingCommand={setCreatingCommand}>
					{creatingCommand === "text" ? <CreateTextCommand guild={userConnectedGuildInfo} /> : <CreateRoleCommand guild={userConnectedGuildInfo} />}
				</CreateCommand>
			</Modal>
			<div className="plugin-item-header">
				<span className="title">
					<img src={`${process.env.PUBLIC_URL}/aprove.png`} alt="" />
					<h2>Custom Commands</h2>
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
					<div
						className="create-command"
						onClick={() => {
							setupCommand();
							setCreatingCommand("text");
						}}
					>
						<h1>Text Command</h1>
						<p>A simple command that responds with a custom message in DM or public</p>
					</div>
					<div
						className="create-command"
						onClick={() => {
							setupCommand();
							setCreatingCommand("role");
						}}
					>
						<h1>Role Command</h1>
						<p>A simple command that toggles a role for the user</p>
					</div>
				</div>
				<h4 className="plugin-section-title bigger">
					Your Commands<span> — {Object.keys(commands).length}</span>
				</h4>
				{Object.entries(commands)
					.sort((a, b) => a[0].localeCompare(b[0]))
					.sort((a, b) => (a[1].type === "role" ? -1 : 1))
					.map(([key, value]) => (
						<CommandItem guild={userConnectedGuildInfo} setCommands={setCommands} setCreatingCommand={setCreatingCommand} allowedRoles={value.permittedRoles} {...value} name={key} key={key} />
					))}
			</div>
		</div>
	);
};

export default memo(CustomCommands);
