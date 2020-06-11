import React, {useEffect, useState} from "react"
import firebase from "./firebase"
import "./App.css"
import {HashRouter as Router, Route, Redirect, Switch} from "react-router-dom"
import Home from "./components/Home/Home"
import About from "./components/About/About"
import Community from "./components/Community/Community"
import Bot from "./components/Bot/Bot"
import Apps from "./components/Apps/Main"
import Footer from "./components/Footer/Footer"
import Dashboard from "./components/Users/Dashboard"
import Team from "./components/Team/Team"
import Header from "./components/header/Header"
import ProtectedRoute from "./components/Shared/ProtectedRoute"
import Loader from "react-loader"

import { AppContext } from "./contexts/Appcontext";

function App(props) {
	const [userId, setUserId] = useState("");
	const [dropDownOpen, setDropDownOpen] = useState(false);
	const [currentUser, setCurrentUser] = useState();
	const [firebaseInit, setFirebaseInit] = useState(false);

	useEffect(() => {
		(async () => {
			const result = await firebase.isInitialized();
			setFirebaseInit(result);
		})();
	}, []);

	useEffect(() => {
		const codeArray = new URLSearchParams(window.location.search);
		if (codeArray.has("code")) {
			(async () => {
				const code = codeArray.get("code");
				if (!codeArray.has("discord")) {
					try {
						const response = await fetch(
							"https://api.distwitchchat.com/token?code=" + code
						);
						const json = await response.json();
						if (response.ok) {
							const result = await firebase.auth.signInWithCustomToken(
								json.token
							);
							const uid = result.user.uid;
							const {
								displayName,
								profilePicture,
								ModChannels,
							} = json;
							try {
								await firebase.db
									.collection("Streamers")
									.doc(uid)
									.update({
										displayName,
										profilePicture,
										ModChannels,
									});
							} catch (err) {
								await firebase.db
									.collection("Streamers")
									.doc(uid)
									.set({
										displayName,
										uid,
										profilePicture,
										ModChannels,
										TwitchName: displayName.toLowerCase(),
										appSettings: {
											TwitchColor: "",
											YoutubeColor: "",
											discordColor: "",
											displayPlatformColors: false,
											displayPlatformIcons: false,
											highlightedMessageColor: "",
											showHeader: true,
											showSourceButton: false,
											compact: false,
											showBorder: false,
											nameColors: true,
										},
										discordLinked: false,
										guildId: "",
										liveChatId: "",
										overlaySettings: {
											TwitchColor: "",
											YoutubeColor: "",
											discordColor: "",
											displayPlatformColors: false,
											displayPlatformIcons: false,
											highlightedMessageColor: "",
											nameColors: true,
											compact: false,
										},
										twitchAuthenticated: true,
										youtubeAuthenticated: false,
									});
							}
						}
					} catch (err) {}
				} else {
					try {
						const response = await fetch(
							"https://api.distwitchchat.com/discord/token?code=" +
								code
						);
						// const response = await fetch("http://localhost:3200/discord/token?code="+code)
						if (!response.ok) {
							console.log(await response.text());
						} else {
							const json = await response.json();
							console.log(json);
							await firebase.db
								.collection("Streamers")
								.doc(firebase?.auth?.currentUser?.uid || " ")
								.collection("discord")
								.doc("data")
								.set(json);
						}
					} catch (err) {
						console.log(err.message);
					}
				}
				window.location = "/#/dashboard/login";
			})();
		}
	}, []);

	return firebaseInit !== false &&
		!new URLSearchParams(window.location.search).has("code") ? (
		<Router>
			<AppContext.Provider
				value={{
					userId,
					setUserId,
					dropDownOpen,
					setDropDownOpen,
					currentUser,
					setCurrentUser,
				}}
			>
				<Switch>
					<div className="App">
						<Header />
						<main className={`main ${dropDownOpen && "open"}`}>
							<Switch>
								<Route exact path="/" component={Home} />
								<Route path="/bot" component={Bot} />
								<Route exact path="/apps" component={Apps} />
								<Route
									path="/community"
									component={Community}
								/>
								<Route path="/about" component={About} />
								<Route path="/members" component={Team} />
								<ProtectedRoute
									path="/dashboard"
									component={Dashboard}
								/>
								<Redirect to="/" />
							</Switch>
						</main>
						<Footer />
					</div>{" "}
					: <></>
				</Switch>
			</AppContext.Provider>
		</Router>
	) : (
		<main className="App">
			<Loader
				loaded={false}
				lines={15}
				length={0}
				width={15}
				radius={35}
				corners={1}
				rotate={0}
				direction={1}
				color={"#fff"}
				speed={1}
				trail={60}
				shadow={true}
				hwaccel={true}
				className="spinner"
				zIndex={2e9}
				top="50%"
				left="50%"
				scale={3.0}
				loadedClassName="loadedContent"
			/>
		</main>
	);
}

export default App;
