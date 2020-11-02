import { useContext } from "react";
import RoleItem from "../../../../../styled-components/RoleItem";
import { CommandContext } from "../../../../../contexts/CommandContext";
import StyledSelect from "../../../../../styled-components/StyledSelect";

const CreateRoleCommand = ({ setCreatingCommand, guild: userConnectedGuildInfo }) => {
	const { roleToGive, setRoleToGive } = useContext(CommandContext);
	return (
		<>
			<h4 className="plugin-section-title">Role To give</h4>
			<div className="plugin-section">
				<StyledSelect
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
				/>
			</div>
		</>
	);
};

export default CreateRoleCommand;
