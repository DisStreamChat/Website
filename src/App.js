// production
import React, { useEffect, useState, useRef } from "react";
import firebase from "./firebase";
import { HashRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Community from "./components/Community/Community";
import Bot from "./components/Bot/Bot";
import Apps from "./components/Apps/Main";
import Footer from "./components/Footer/Footer";
import Dashboard from "./components/DashBoard/Dashboard";
import Team from "./components/Team/Team";
import Header from "./components/header/Header";
import ProtectedRoute from "./components/Shared/ProtectedRoute";
import Loader from "react-loader";
import DownloadPage from "./components/Apps/DownloadPage";
import PrivacyPolicy from "./components/Shared/PrivacyPolicy";
import Terms from "./components/Shared/Terms";

import "./App.scss";
import { AppContext } from "./contexts/Appcontext";
import Banner from "./components/Shared/Banner";
import { Button } from "@material-ui/core";
import A from "./components/Shared/A";
import useSnapshot from "./hooks/useSnapshot";
import LeaderBoard from "./components/LeaderBoard/LeaderBoard";
import { v4 as uuidv4 } from 'uuid';

function App(props) {
	const [userId, setUserId] = useState("");
	const [dropDownOpen, setDropDownOpen] = useState(false);
	const [currentUser, setCurrentUser] = useState();
	const [firebaseInit, setFirebaseInit] = useState(false);
	const user = firebase.auth.currentUser;

	useSnapshot(
		firebase.db.collection("Streamers").doc(userId || " "),
		async snapshot => {
			const data = snapshot.data();
			const discordData = (await snapshot.ref.collection("discord").doc("data").get()).data();
			if (data) {
				setCurrentUser({ ...data, discordData });
			}
		},
		[userId]
	);

	useEffect(() => {
		(async () => {
			const result = await firebase.isInitialized();
			setFirebaseInit(result);
		})();
	}, []);

	const setOTC = useRef(false);
	useEffect(() => {
		(async () => {
			if (setOTC.current) return;
			if (firebaseInit !== false && user?.uid) {
                await firebase.db.collection("Secret").doc(user.uid).set({value: uuidv4()});
                setOTC.current = true
			}
		})();
	}, [firebaseInit, user, setOTC]);

	useEffect(() => {
		if (firebaseInit === false) return;
		const codeArray = new URLSearchParams(window.location.search);
		if (codeArray.has("code")) {
			(async () => {
				const code = codeArray.get("code");
				if (!codeArray.has("discord")) {
					try {
						const response = await fetch("https://api.disstreamchat.com/token?code=" + code);
						const json = await response.json();
						if (response.ok) {
							await firebase.auth.signInWithCustomToken(json.token);
						}
					} catch (err) {}
				} else {
					try {
						console.log(code);
						const response = await fetch(`${process.env.REACT_APP_API_URL}/discord/token?code=${code}`);
						// const response = await fetch("http://localhost:3200/discord/token?code="+code)
						if (!response.ok) {
							console.log(await response.json());
							console.log("fail");
						} else {
							console.log(user?.uid);
							const json = await response.json();
							await firebase.db
								.collection("Streamers")
								.doc(user?.uid || " ")
								.collection("discord")
								.doc("data")
								.set(json);
							console.log("success");
						}
					} catch (err) {
						console.log(err.message);
					}
				}
				window.location = "/#/dashboard/discord";
			})();
		}
	}, [firebaseInit]);

	useEffect(() => {
		(async () => {
			if (firebaseInit !== false && user) {
				setUserId(user.uid);
				const userData = (await firebase.db.collection("Streamers").doc(user.uid).get()).data();
				const profilePictureResponse = await fetch(`${process.env.REACT_APP_API_URL}/profilepicture?user=${userData?.TwitchName}`);
				const profilePicture = await profilePictureResponse.json();
				firebase.db.collection("Streamers").doc(user.uid).update({
					profilePicture,
				});
			}
		})();
	}, [firebaseInit, user]);

	return firebaseInit !== false && !new URLSearchParams(window.location.search).has("code") ? (
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
								<Route path="/community" component={Community} />
								<Route path="/about" component={About} />
								<Route path="/members" component={Team} />
								<Route path="/privacy" component={PrivacyPolicy} />
								<Route path="/terms" component={Terms} />
								<Route path="/apps/download" component={DownloadPage} />
								<Route path="/leaderboard/:id" component={LeaderBoard} />
								<ProtectedRoute path="/dashboard" component={Dashboard} />
								<Redirect to="/" />
							</Switch>
						</main>
						<Footer />
					</div>{" "}
					: <></>
				</Switch>
				<Banner message="DisStreamChat is in early alpha and we would like your help to test it">
					<A newTab href="https://api.disstreamchat.com/discord">
						<Button className="banner-button">Join the Discord</Button>
					</A>
				</Banner>
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
