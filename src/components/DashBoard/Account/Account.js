import React, { useContext } from "react";
import { AppContext } from "../../../contexts/Appcontext";
import "./Accounts.scss";
import AccountComponent from "./AccountComponent";

const Account = () => {
	const { currentUser } = useContext(AppContext);

	return (
		<div classname="accounts" style={{ width: "100%" }}>
			<AccountComponent platform="twitch" />
			<AccountComponent platform="discord" />
		</div>
	);
};

export default Account;
