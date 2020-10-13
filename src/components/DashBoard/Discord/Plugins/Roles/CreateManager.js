import ClearIcon from "@material-ui/icons/Clear";
import { DiscordContext } from "../../../../../contexts/DiscordContext";
import React, { useEffect, useState, useCallback, useContext } from "react";
import Select from "react-select";
import { colorStyles } from "../../../../Shared/userUtils";
import RoleItem from "../../../../Shared/RoleItem";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Switch } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { blueGrey } from "@material-ui/core/colors";
import { RoleContext } from "../../../../../contexts/RoleContext";
import firebase from "../../../../../firebase";
import { ActionItem } from "./ManagerItem";

const FancySwitch = withStyles({
	root: {
		padding: 7,
	},
	thumb: {
		width: 24,
		height: 24,
		backgroundColor: "#fff",
		boxShadow: "0 0 12px 0 rgba(0,0,0,0.08), 0 0 8px 0 rgba(0,0,0,0.12), 0 0 4px 0 rgba(0,0,0,0.38)",
	},
	switchBase: {
		color: "rgba(0,0,0,0.38)",
		padding: 7,
	},
	track: {
		borderRadius: 20,
		backgroundColor: blueGrey[300],
	},
	checked: {
		"& $thumb": {
			backgroundColor: "#fff",
		},
		"& + $track": {
			opacity: "1 !important",
		},
	},
	focusVisible: {},
})(Switch);

const parseSelectValue = value => {
	if (value instanceof Array) {
		if (value.length === 0) return value;
		return value.map(role => JSON.parse(role.value.split("=")[1])).map(val => val.id);
	} else {
		try {
			return JSON.parse(value.value.split("=")[1]).id;
		} catch (err) {
			return null;
		}
	}
};

const CreateManager = ({ setCreatingCommand, guild: userConnectedGuildInfo }) => {
    const { state, update, error, setup } = useContext(RoleContext);
    const [addingAction, setAddingAction] = useState(false);

	return (
		<>
			<div className="command-header">
				<h1>Create {state.type === "message" ? "Message" : "Member Join"} Manager</h1>
				<button onClick={setup}>
					<ClearIcon />
				</button>
			</div>
			<div className="command-body">
				<h4 className="plugin-section-title">Manager Message</h4>
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
				<h4 className="plugin-section-title">Manager Actions</h4>
				<div className="plugin-section">
					{state?.manager?.actions?.map(action => (
						<ActionItem {...action} guild={userConnectedGuildInfo} deleteAble={false}></ActionItem>
					))}
                    {addingAction && (
                        <ActionItem adding deleteAble={false}/>
                    )}
					<ActionItem onClick={() => setAddingAction(true)} add deleteAble={false} />
				</div>
				<h4 className="plugin-section-title">DM User</h4>
				<div className="plugin-section" style={{ paddingLeft: ".75rem" }}>
					<FormControlLabel
						control={
							<FancySwitch
								color="primary"
								checked={!!state.manager.DMuser}
								onChange={e => {
									update("manager.DMuser", e.target.checked);
								}}
								name={"dm_user"}
							/>
						}
						label={"DM User"}
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

						commandRef.update({ [state.manager.message]: state.manager });

						setCreatingCommand(false);
					}}
				>
					{state.editing ? "Update" : "Create"}
				</button>
			</div>
		</>
	);
};

export default CreateManager;
