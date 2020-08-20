import React from "react";
import "./Home.scss";

import { Link } from "react-router-dom";
import { useTitle } from "react-use";
import firebase from "../../firebase";
import A from "../Shared/A";

const Home = () => {
	useTitle("DisStreamChat");

	const currentUser = firebase.auth.currentUser;

	return (
		<>
			<div className="main-view">
				<div className="header-area">
					<h1 className="body-header">Integrate your Discord server with Twitch</h1>
					<h3 className="body-subheader">Chat, moderation, interactivity, and much more easily Integrated with Twitch and Discord!</h3>
				</div>
				<div className="buttons">
					<A href="#features" className="main-button dashboard-button">
						See Features
					</A>

					{currentUser && (
						<Link to={`/dashboard`} className="dashboard-button">
							My DashBoard
						</Link>
					)}
				</div>
			</div>

			<div className="landing high-margin" id="features">
				<section className="feature">
					<div className="left">
						<h1>Manage all your chats from one app</h1>
						<h3>
							Open, interact with, moderate and do so much more for any channel you own or moderate for. You can even open multiple
							chats at once by ctrl+clicking them and be a super-moderator of doom!
						</h3>
					</div>
					<div className="right">
						<img src={`${process.env.PUBLIC_URL}/home.png`} alt="" />
					</div>
				</section>
				<section className="feature">
					<div className="left two-images">
						<img src={`${process.env.PUBLIC_URL}/appsettings.png`} alt="" />
						<img src={`${process.env.PUBLIC_URL}/settings.png`} alt="" />
					</div>
					<div className="right">
						<h1>Customize just about anything</h1>
						<h3>
							You have the option to customize an abundance of different settings both within the app and on the website. Updating a
							setting anywhere will apply them on the client immediately so you could change those secret settings off screen.
						</h3>
					</div>
				</section>
				<section className="feature">
					<div className="left">
						<h1>Never miss a new follower again</h1>
						<h3>
							Get all the notifications you could ever wish for in the app, like followers, subscriptions, bits and many more. Customize
							them to fit your style or ignore them completely, whichever serves you and your army of viewing minions best.
						</h3>
					</div>
					<div className="right"></div>
				</section>
				<section className="feature">
					<div className="left"></div>
					<div className="right">
						<h1>No more scrolling for days looking for that one message</h1>
						<h3>
							DisStreamChat provides an easy to use searchbar that you can access through ctrl+f, not only does it allow you to search
							for that amazing cat gif you just missed, it also allows you to use tags to search for things like follows, links,
							usernames and plenty more.
						</h3>
					</div>
				</section>
				<section className="feature">
					<div className="left">
						<h1>Turn the app into an overlay that actually shows</h1>
						<h3>
							Set key-binds of your choice to make the app turn between focused and unfocused mode. When unfocused the app becomes as
							transparent as you want and allows you to interact with anything behind it. It's basically an overlay that works live on
							your own screen. Perfect for single monitor streamers or multiple monitor streamers that still don't have enough screen
							space.
						</h3>
					</div>
					<div className="right"></div>
				</section>
				<section className="feature">
					<div className="left"></div>
					<div className="right">
						<h1>Integrate your super-secret exclusive discord chat channel</h1>
						<h3>
							Set up the discord bot to listen to any channels you want and integrate any chat going on in those chats into your chat
							client. At least now you can see your moderators talking about your messed up audio right from your own chat.
						</h3>
					</div>
				</section>
			</div>
		</>
	);
};

export default Home;
