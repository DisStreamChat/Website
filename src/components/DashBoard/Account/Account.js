import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../contexts/Appcontext";
import "./Accounts.scss";
import AccountComponent from "./AccountComponent";
import firebase from "../../../firebase";

const Account = () => {
	const currentUser = firebase.auth.currentUser;
	const [discordAccount, setDiscordAccount] = useState();
	const [twitchAccount, setTwitchAccount] = useState();

	useEffect(() => {
		(async () => {
			const userRef = firebase.db.collection("Streamers").doc(currentUser?.uid);
			const discordRef = userRef.collection("discord").doc("data");
			const twitchRef = userRef.collection("twitch").doc("data");
			const userData = (await userRef.get()).data();
			if (!userData) return;
			const discordData = (await discordRef.get()).data();
			const twitchData = (await twitchRef.get()).data();
			if (discordData) {
				const {name, profilePicture} = discordData
				setDiscordAccount({name, profilePicture});
			} else {
				setDiscordAccount(null);
			}
			if(twitchData){
				const {name, profilePicture} = userData
				setTwitchAccount({name, profilePicture});
			}
		})();
	}, [currentUser]);

	return (
		<div classname="accounts" style={{ width: "100%" }}>
			{twitchAccount && <AccountComponent {...twitchAccount} platform="twitch" />}
			{discordAccount && <AccountComponent {...discordAccount} platform="discord" />}
		</div>
	);
};

export default Account;
