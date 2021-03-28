import "./Home.scss";
import "./Home.css";

import { Link } from "react-router-dom";
import { useTitle } from "react-use";
import firebase from "../../firebase";
import A from "../Shared/A";
import Feature from "../Shared/Feature";

const Home = () => {
	useTitle("DisStreamChat");

	const currentUser = firebase.auth.currentUser;

	return (
		<>
			<div className="main-view">
				<div className="header-area">
					<h1 className="body-header">Integrate your Discord server with Twitch</h1>
					<h3 className="body-subheader">
						Chat, moderation, interactivity, and much more easily Integrated with Twitch
						and Discord!
					</h3>
				</div>
				<div className="buttons">
					<A href="#features" className="main-button dashboard-button">
						See Features
					</A>
					<A
						href="https://invite.disstreamchat.com"
						className="main-button dashboard-button"
					>
						Add to Discord
					</A>
					{currentUser && (
						<Link to="/dashboard" className="dashboard-button">
							My DashBoard
						</Link>
					)}
				</div>
			</div>
			<img src={`${process.env.PUBLIC_URL}/wave_top.svg`} alt="" />
			<div className="landing-background">
				<div className="landing" id="features">
					<Feature
						title="Manage all your chats from one app"
						body="Open, interact with, moderate and do so much more for any channel you own or moderate for. You can even open multiple
							chats at once by ctrl+clicking them and be a super-moderator of doom!"
						images={[`${process.env.PUBLIC_URL}/home.png`]}
					></Feature>
					<Feature
						title="Customize just about anything"
						body="You have the option to customize an abundance of different settings both within the app and on the website. Updating a
                setting anywhere will apply them on the client immediately so you could change those secret settings off screen."
						images={[
							`${process.env.PUBLIC_URL}/merged2.png`,
						]}
						imageClassNames={["drop-shadow"]}
						reversed
					></Feature>
					<Feature
						title="Never miss a new follower again"
						body="Get all the notifications you could ever wish for in the app, like followers, subscriptions, bits and many more. Customize
                them to fit your style or ignore them completely, whichever serves you and your army of viewing minions best."
						images={[`${process.env.PUBLIC_URL}/notifications.png`]}
					></Feature>
					<Feature
						title="No more scrolling for days looking for that one message"
						body="DisStreamChat provides an easy to use searchbar that you can access through ctrl+f, not only does it allow you to search
                for that amazing cat gif you just missed, it also allows you to use tags to search for things like follows, links,
                usernames and plenty more."
						images={[`${process.env.PUBLIC_URL}/merged1.png`]}
						imageClassNames={["drop-shadow"]}
						reversed
					></Feature>
					<Feature
						title="Turn the app into an overlay that actually shows"
						body="Set key-binds of your choice to make the app turn between focused and unfocused mode. When unfocused the app becomes as
							transparent as you want and allows you to interact with anything behind it. It's basically an overlay that works live on
							your own screen. Perfect for single monitor streamers or multiple monitor streamers that still don't have enough screen
                            space."
						images={[`${process.env.PUBLIC_URL}/unfocus.png`]}
					></Feature>
					<Feature
						title="Integrate your super-secret exclusive discord chat channel"
						body="Set up the discord bot to listen to any channels you want and integrate any chat going on in those chats into your chat
							client. At least now you can see your moderators talking about your messed up audio right from your own chat."
						images={[`${process.env.PUBLIC_URL}/discordmessage.png`]}
						reversed
					></Feature>
					{/* <Feature
						title="Integrate your super-secret exclusive discord chat channel"
						body="Set up the discord bot to listen to any channels you want and integrate any chat going on in those chats into your chat
							client. At least now you can see your moderators talking about your messed up audio right from your own chat."
						images={[`${process.env.PUBLIC_URL}/discordmessage.png`]}
						reversed
					></Feature> */}
				</div>
			</div>
			<img id="bottom-img" src={`${process.env.PUBLIC_URL}/wave_invert.svg`} alt="" />
		</>
	);
};

export default Home;
