import ClearIcon from "@material-ui/icons/Clear";
import { DiscordContext } from "../../../../contexts/DiscordContext";
import React, { useEffect, useState, useCallback, useContext } from "react";
import Select from "react-select";
import { colorStyles } from "../../../Shared/userUtils";
import RoleItem from "../../../Shared/RoleItem";

const CreateRoleCommand = ({ setCreatingCommand }) => {
	const { setActivePlugins, userConnectedGuildInfo } = useContext(DiscordContext);
	return (
		<>
			<h4 className="plugin-section-title">Role To give</h4>
			<div className="plugin-section">
				<Select
					closeMenuOnSelect
					onChange={() => {}}
					placeholder="Select Command Role"
					value={undefined}
					options={userConnectedGuildInfo?.roles
						?.filter(role => role.name !== "@everyone")
						?.sort((a, b) => b.rawPosition - a.rawPosition)
						?.map(role => ({
							value: `${role.name}:${role.id}`,
							label: <RoleItem {...role}>{role.name}</RoleItem>,
						}))}
					styles={{
						...colorStyles,
						container: styles => ({
							...styles,
							...colorStyles.container,
						}),
					}}
				/>
			</div>
		</>
	);
};

export default CreateRoleCommand;
