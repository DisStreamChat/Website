import { useContext } from "react";
import ClearIcon from "@material-ui/icons/Clear";
import RoleItem from "../../../../../styled-components/RoleItem";
import firebase from "../../../../../firebase";
import { RoleContext } from "../../../../../contexts/RoleContext";
import StyledSelect from "../../../../../styled-components/StyledSelect";

const CreateJoinManager = ({ setCreatingCommand, guild: userConnectedGuildInfo }) => {
	const { state, update, error, setup } = useContext(RoleContext);

	return (
		<>
			<div className="command-header">
				<h1>Create Join Roles</h1>
				<button onClick={setup}>
					<ClearIcon />
				</button>
			</div>
			<div className="command-body">
				<h4 className="plugin-section-title">Member Join Roles</h4>
				<div className="plugin-section">
					<StyledSelect
						isMulti
						closeMenuOnSelect={false}
						onChange={e => {
							update("manager.actions['user-join']", e);
						}}
						placeholder="Select Reaction Role"
						value={state?.manager?.actions?.["user-join"] || ""}
						options={userConnectedGuildInfo?.roles
							?.filter(role => role.name !== "@everyone" && !role.managed)
							?.sort((a, b) => b.rawPosition - a.rawPosition)
							?.map(role => ({
								value: `${role.name}=${JSON.stringify(role)}`,
								label: <RoleItem {...role}>{role.name}</RoleItem>,
							}))}
					/>
				</div>
			</div>
			<div className={`command-footer ${state.error?.message ? "error" : ""}`}>
				{state.error?.message && (
					<span className="error-message">{state.error?.message}</span>
				)}
				<button
					onClick={async () => {
						error(null);
						if (!state?.manager?.message?.length)
							return error("The Manager have a message id");
						const commandRef = firebase.db
							.collection("reactions")
							.doc(userConnectedGuildInfo.id);
						const manager = { ...state.manager };
						manager.actions["user-join"] = {
							role: JSON.parse(state.manager.actions["user-join"].value.split("=")[1])
								.id,
						};
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

export default CreateJoinManager;
