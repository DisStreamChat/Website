import { useState } from "react";
import { createContext } from "react";

export const AppContext = createContext();

export const AppContextProvider = props => {
	const [userId, setUserId] = useState("");
	const [dropDownOpen, setDropDownOpen] = useState(false);
	const [currentUser, setCurrentUser] = useState();

	return (
		<AppContext.Provider
			value={{
				userId,
				setUserId,
				dropDownOpen,
				setDropDownOpen,
				currentUser,
				setCurrentUser,
			}}
			{...props}
		/>
	);
};

