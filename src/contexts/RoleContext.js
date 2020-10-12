import React, { createContext } from "react";
import { useState } from "react";

export const RoleContext = createContext({});

export const RoleContextProvider = props => {
	const [addingAction, setAddingAction] = useState(false)
	const [editing, setEditing] = useState(false);
    const [error, setError] = useState({});
    

	return (
		<RoleContext.Provider
			value={{
				editing,
				setEditing,
                addingAction,
                setAddingAction,
				error,
				setError,
			}}
		>
			{props.children}
		</RoleContext.Provider>
	);
};
