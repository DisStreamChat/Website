import ClearIcon from "@material-ui/icons/Clear";
import { DiscordContext } from "../../../../../contexts/DiscordContext";
import React, { useEffect, useState, useCallback, useContext } from "react";
import Select from "react-select";
import { colorStyles } from "../../../../Shared/userUtils";
import RoleItem from "../../../../Shared/RoleItem";
import { CommandContext } from "../../../../../contexts/CommandContext";

const CreateRoleCommand = ({ setCreatingCommand, guild: userConnectedGuildInfo }) => {
    const { roleToGive, setRoleToGive } = useContext(CommandContext);
	return (
		<>
			<h4 className="plugin-section-title">Role To give</h4>
			<div className="plugin-section">
				<Select
					closeMenuOnSelect
					onChange={e => {
						setRoleToGive(e);
					}}
					placeholder="Select Command Role"
					value={roleToGive}
					options={userConnectedGuildInfo?.roles
						?.filter(role => role.name !== "@everyone")
						?.filter(role => !role.managed)
						?.sort((a, b) => b.rawPosition - a.rawPosition)
						?.map(role => ({
							value: `${role.name}=${JSON.stringify(role)}`,
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
