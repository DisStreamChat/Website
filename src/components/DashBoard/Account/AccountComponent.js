import styled from "styled-components";
import firebase from "../../../firebase";

const logos = {
	discord: "https://cdn.iconscout.com/icon/free/png-512/discord-3-569463.png",
	twitch: "/social-media.svg",
};

const AccountName = styled.p`
	text-transform: capitalize;
`;

const DiscordComponent = ({ main, profilePicture, platform, name }) => {
	const currentUser = firebase.auth.currentUser;
	const disconnect = async () => {
		await firebase.db
			.collection("Streamers")
			.doc(currentUser?.uid || " ")
			.collection(platform)
			.doc("data")
			.delete();
	};

	// TODO finish implementing this
	// const deleteAccount = async () => {
	// 	await firebase.db
	// 		.collection("Streamers")
	// 		.doc(currentUser?.uid || " ")
	// 		.delete();
	// 	try {
	// 		await currentUser.delete();
	// 	} catch (err) {
	// 		// re-sign in and delete
	// 	}
	// };

	return (
		<div className="account discord">
			<div className={`account-header ${platform}`}>
				<img src={logos[platform]} alt="" />
				<img src={profilePicture} alt="" />
				<div className="name">
					<AccountName>{name}</AccountName>
					<p>Account Name</p>
				</div>
			</div>
			<div className={`account-body ${platform}`}>
				{main !== platform && (
					<button onClick={() => (main === platform ? null : disconnect())}>{main === platform ? "Delete" : "Disconnect"} Account</button>
				)}
			</div>
		</div>
	);
};

export default DiscordComponent;
