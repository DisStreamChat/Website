import React, { useCallback } from "react";
import "./CommandItem.scss";

import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";

const CommandItem = ({ name, message, description, type }) => {
	const deleteMe = useCallback(() => {}, []);

	return (
		<div className="command-item">
			<div className="delete-button" onClick={deleteMe}>
				<CancelTwoToneIcon />
			</div>
			<div className="command-item--info">
				<h3>{name}</h3>
				<h4>{description}</h4>
			</div>
			<div className="command-item--options">
				<button>Edit</button>
			</div>
		</div>
	);
};

export default CommandItem;
