import { memo, useEffect, useState, useContext } from "react";
import firebase from "../../../../../firebase";
import { RoleContext } from "../../../../../contexts/RoleContext";
import ManagerItem from "./ManagerItem";
import Modal from "react-modal";
import CreateManager from "./CreateManager";
import CreateJoinManager from "./CreateJoinManager";

const Roles = ({ location, guild: userConnectedGuildInfo }) => {
	const [MessageManagers, setMessageManagers] = useState([]);
	const [JoinManager, setJoinManager] = useState();
	const { state, create, setup } = useContext(RoleContext);
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
		document.body.style.overflow = state.type ? "hidden" : "initial";
		return () => {
			document.body.style.overflow = "initial";
		};
	}, [state]);

	return (
		<div>
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
							// create("message");
						}}
					>
						<h1>Command Role</h1>
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
							<p>Automatically give a user a role when they join your server</p>
						</div>
					)}
				</div>
				{!state.type && JoinManager && (
					<>
						<h4 className="plugin-section-title bigger">Join Roles</h4>
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
					MessageManagers.sort((a, b) =>
						a.message.localeCompare(b.message)
					).map((manager, i) => (
						<ManagerItem key={i} {...manager} guild={userConnectedGuildInfo} />
					))}
			</div>
		</div>
	);
};

export default memo(Roles);
