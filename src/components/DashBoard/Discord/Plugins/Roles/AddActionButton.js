import { ActionBody } from "../../../../../styled-components/ReactionRoleComponents";
import AddCircleTwoToneIcon from "@material-ui/icons/AddCircleTwoTone";

const AddActionButton = ({onClick}) => {
	return (
		<ActionBody adding={false}>
			<span
				onClick={() => onClick?.()}
				style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
			>
				<AddCircleTwoToneIcon />
				<h4 style={{ marginLeft: ".5rem" }}>Add Action</h4>
			</span>
		</ActionBody>
	);
};

export default AddActionButton;
