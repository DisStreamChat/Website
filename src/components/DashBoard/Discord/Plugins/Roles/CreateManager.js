import ClearIcon from "@material-ui/icons/Clear";

import React, { useState, useContext } from "react";

import { RoleContext } from "../../../../../contexts/RoleContext";
import firebase from "../../../../../firebase";
import CreateAction from "./CreateAction";
import { ActionItem } from "./ManagerItem";

const CreateManager = ({ setCreatingCommand, guild: userConnectedGuildInfo }) => {
	const { state, update, error, setup, addReaction } = useContext(RoleContext);
	const [addingAction, setAddingAction] = useState(false);

	return (
		<>
			<div className="command-header">
				<h1>Create {state.type === "message" ? "Reaction" : "Join"} Roles</h1>
				<button onClick={setup}>
					<ClearIcon />
				</button>
			</div>
			<div className="command-body">
				<h4 className="plugin-section-title">Message</h4>
				<div className="plugin-section">
					<input
						disabled={state.editing}
						value={state.manager.message}
						onChange={e => update("manager.message", e.target.value)}
						placeholder="Message Id"
						type="text"
						className="prefix-input"
						id="manager-message"
					/>
				</div>
				<h4 className="plugin-section-title">Reactions</h4>
				<div className="plugin-section">
					{Object.entries(state?.manager?.actions || {})?.map(([key, action]) => (
						<ActionItem {...action} emoji={key} guild={userConnectedGuildInfo} deleteAble={false}></ActionItem>
					))}
					{addingAction && (
						<CreateAction
							close={() => setAddingAction(false)}
							index={(state.manager?.actions?.length || -1) + 1}
							guild={userConnectedGuildInfo}
							adding
							deleteAble={false}
						/>
					)}
					<ActionItem
						onClick={() => {
							setAddingAction(true);
						}}
						add
						deleteAble={false}
					/>
				</div>
			</div>
			<div className={`command-footer ${state.error?.message ? "error" : ""}`}>
				{state.error?.message && <span className="error-message">{state.error?.message}</span>}
				<button
					onClick={async () => {
						error(null);
						if (!state?.manager?.message?.length) return error("The Manager have a message id");
						const commandRef = firebase.db.collection("reactions").doc(userConnectedGuildInfo.id);
						const manager = { ...state.manager };
						console.log(manager);
						// manager.actions = manager.actions.map(action => ({...action, DMuser: !!action.DMuser}))

						commandRef.update({ [state.manager.message]: manager });

						setup();
					}}
				>
					{state.editing ? "Update" : "Create"}
				</button>
			</div>
		</>
	);
};

export default CreateManager;
