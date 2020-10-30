import { useEffect, useState } from "react";
import "./Accounts.scss";
import AccountComponent from "./AccountComponent";
import firebase from "../../../firebase";

const Account = () => {
	const currentUser = firebase.auth.currentUser;
	const [discordAccount, setDiscordAccount] = useState();
	const [twitchAccount, setTwitchAccount] = useState();
	const [mainAccount, setMainAccount] = useState();

	useEffect(() => {
		(async () => {
			const userRef = firebase.db.collection("Streamers").doc(currentUser?.uid);
			const discordRef = userRef.collection("discord").doc("data");
			const twitchRef = userRef.collection("twitch").doc("data");
			const userData = (await userRef.get()).data();

			if (!userData) return;
			const twitchData = (await twitchRef.get()).data();
			discordRef.onSnapshot(snapshot => {
				const discordData = snapshot.data();
				if (discordData) {
					const { name, profilePicture } = discordData;
					setDiscordAccount({ name, profilePicture });
				} else {
					setDiscordAccount(null);
				}
			});
			if (twitchData) {
				const { name, profilePicture } = userData;
				setTwitchAccount({ name, profilePicture });
			}
			if (userData.discordLinked) setMainAccount("discord");
			else if (userData.twitchAuthenticated) setMainAccount("twitch");
		})();
	}, [currentUser]);

	return (
		<div classname="accounts" style={{ width: "100%" }}>
			{twitchAccount && (
				<AccountComponent main={mainAccount} {...twitchAccount} platform="twitch" />
			)}
			{discordAccount && (
				<AccountComponent main={mainAccount} {...discordAccount} platform="discord" />
			)}
		</div>
	);
};

export default Account;
