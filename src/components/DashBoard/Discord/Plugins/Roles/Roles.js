import { memo, useEffect, useState, useContext, useLayoutEffect } from "react";
import firebase from "../../../../../firebase";
import { RoleContext } from "../../../../../contexts/RoleContext";
import ManagerItem from "./ManagerItem";
import Modal from "react-modal";
import CreateManager from "./CreateManager";
import CreateJoinManager from "./CreateJoinManager";
import CommandItem from "../CustomCommands/CommandItem";
import CreateCommand from "../CustomCommands/CreateCommand";
import CreateRoleCommand from "../CustomCommands/CreateRoleCommand";

const Roles = ({ location, guild: userConnectedGuildInfo }) => {
	const [MessageManagers, setMessageManagers] = useState([]);
	const [JoinManager, setJoinManager] = useState();
	const { state, create, setup } = useContext(RoleContext);
	const [creatingCommand, setCreatingCommand] = useState(false);
	const [commands, setCommands] = useState([]);
	const guildId = userConnectedGuildInfo?.id;

	useEffect(() => {
		const unsub = firebase.db
			.collection("reactions")
			.doc(guildId || " ")
			.onSnapshot(snapshot => {
				const data = snapshot.data();
				if (data) {
					const managerKeys = Object.keys(data).filter(key => key !== "member-join");
					setMessageManagers(managerKeys.map(key => ({ message: key, ...data[key] })));
					if (data["member-join"]) {
						setJoinManager({ message: "member-join", ...data["member-join"] });
					} else {
						setJoinManager(null);
					}
				}
			});
		return unsub;
	}, [location, guildId]);

	useEffect(() => {
		const unsub = firebase.db
			.collection("customCommands")
			.doc(guildId || " ")
			.onSnapshot(snapshot => {
				const data = snapshot.data();
				if (data) {
					const roleCommands = Object.entries(data).filter(
						command => command[1].type === "role"
					);
					console.log(roleCommands);
					if (roleCommands.length) {
						setCommands(roleCommands);
					}
				}
			});
		return unsub;
	}, [location, guildId]);

	useLayoutEffect(() => {
		document.body.style.overflow = state.type || creatingCommand ? "hidden" : "initial";
		return () => {
			document.body.style.overflow = "initial";
		};
	}, [state, creatingCommand]);

	return (
		<div>
			<Modal
				isOpen={creatingCommand}
				className="command-modal Modal"
				overlayClassName="command-overlay Modal-Overlay"
				onRequestClose={() => setCreatingCommand(false)}
			>
				<CreateCommand
					guild={userConnectedGuildInfo}
					role
					setCreatingCommand={setCreatingCommand}
				>
					<CreateRoleCommand guild={userConnectedGuildInfo} />
				</CreateCommand>
			</Modal>
			<Modal
				isOpen={state.type}
				className="command-modal Modal"
				overlayClassName="command-overlay Modal-Overlay"
				onRequestClose={setup}
			>
				{state.type === "message" ? (
					<CreateManager guild={userConnectedGuildInfo}></CreateManager>
				) : (
					<CreateJoinManager guild={userConnectedGuildInfo}></CreateJoinManager>
				)}
			</Modal>
			<div className="plugin-item-header">
				<span className="title">
					<img src={`${process.env.PUBLIC_URL}/trophy.svg`} alt="" />
					<h2>Role Management</h2>
				</span>
			</div>
			<hr />
			<div className="plugin-item-subheader">
				<h4>
					Different ways to have the bot manage user roles. Give a role on join, toggle
					roles with reactions, etc.
				</h4>
			</div>
			<div className="plugin-item-body">
				<h4 className="plugin-section-title">Create Role Manager</h4>
				<div className="command-card-body">
					<div
						className="create-command"
						onClick={() => {
							create("message");
						}}
					>
						<h1>Reaction Role</h1>
						<p>
							allow users to give/remove roles from themselves by reacting to a
							message
						</p>
					</div>
					<div
						className="create-command"
						onClick={() => {
							setCreatingCommand(true);
							// create("message");
						}}
					>
						<h1>Role Command</h1>
						<p>allow users to give/remove roles from themselves by sending a command</p>
					</div>
					{!JoinManager && (
						<div
							className="create-command"
							onClick={() => {
								create("join");
							}}
						>
							<h1>Join Role</h1>
							<p>
								Automatically give a user one or more roles when they join your
								server
							</p>
						</div>
					)}
				</div>
				{!state.type && JoinManager && (
					<>
						<h4 className="plugin-section-title bigger">Join Role</h4>
						<ManagerItem
							guild={userConnectedGuildInfo}
							{...JoinManager}
							join
							channelOveride="Member Join"
						/>
					</>
				)}
				<h4 className="plugin-section-title bigger">
					Reaction Roles<span> — {MessageManagers.length}</span>
				</h4>
				{!state.type &&
					MessageManagers.sort((a, b) => {
						const aMessage = a?.message?.content ? a?.message.content : a?.message;
						const bMessage = b?.message?.content ? b?.message.content : b?.message;
						return aMessage.localeCompare(bMessage);
					}).map((manager, i) => (
						<ManagerItem key={i} {...manager} guild={userConnectedGuildInfo} />
					))}
				<h4 className="plugin-section-title bigger">
					Role Commands<span> — {commands.length}</span>
				</h4>
				{commands
					.sort((a, b) => a[0].localeCompare(b[0]))
					.map(([key, value]) => (
						<CommandItem
							guild={userConnectedGuildInfo}
							setCommands={setCommands}
							setCreatingCommand={setCreatingCommand}
							allowedRoles={value.permittedRoles}
							{...value}
							name={key}
							key={key}
						/>
					))}
			</div>
		</div>
	);
};

export default memo(Roles);
