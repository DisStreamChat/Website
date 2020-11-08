import { useEffect, useState, useRef, useContext } from "react";
import firebase from "./firebase";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
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
import { QueryParamProvider } from "use-query-params";
import Banner from "./components/Shared/Banner";
import { Button } from "@material-ui/core";
import A from "./components/Shared/A";
import useSnapshot from "./hooks/useSnapshot";
import LeaderBoard from "./components/LeaderBoard/LeaderBoard";
import { v4 as uuidv4 } from "uuid";
import { AppContext } from "./contexts/Appcontext";
import "./App.scss";

function App() {
	const [firebaseInit, setFirebaseInit] = useState(false);
	const firebaseUser = firebase.auth.currentUser
	const firebaseUserId = firebaseUser?.uid
	const { userId, setUserId, dropDownOpen, setCurrentUser } = useContext(AppContext);

	const setOTC = useRef(false);
	const codeArray = new URLSearchParams(window.location.search);

	// TODO: replace with react-firebase-hooks
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

	useEffect(() => {
		(async () => {
			if (setOTC.current) return;
			if (firebaseInit !== false && userId) {
				await firebase.db.collection("Secret").doc(userId).set({ value: uuidv4() });
				setOTC.current = true;
			}
		})();
	}, [firebaseInit, setOTC, userId]);

	useEffect(() => {
		if (firebaseInit === false) return;
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
						const isSignedIn = !!firebase.auth.currentUser;
						const response = await fetch(`${process.env.REACT_APP_API_URL}/discord/token?code=${code}&create=${!isSignedIn}`);
						// const response = await fetch("http://localhost:3200/discord/token?code="+code)
						if (!response.ok) {
							console.log(await response.json());
						} else {
							const json = await response.json();
							let discordUser;
							if (!isSignedIn) {
								discordUser = (await firebase.auth.signInWithCustomToken(json.token))?.user;
							}
							await firebase.db
								.collection("Streamers")
								.doc(userId || discordUser?.uid || " ")
								.collection("discord")
								.doc("data")
								.set(json);
							console.log("success");
						}
					} catch (err) {
						console.log(err.message);
					}
				}
				window.location = "/dashboard/discord";
			})();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [firebaseInit]);

	useEffect(() => {
		(async () => {
			console.log(firebaseUser)
			if (firebaseInit !== false && firebaseUserId) {
				setUserId(firebaseUserId);
				try {
					const userData = (await firebase.db.collection("Streamers").doc(firebaseUserId).get()).data();
					console.log({ userData });
					let profilePictureResponse;
					if (!userData.twitchAuthenticated) {
						profilePictureResponse = await fetch(
							`${process.env.REACT_APP_API_URL}/profilepicture?user=${userData?.discordId}&platform=discord`
						);
					} else {
						profilePictureResponse = await fetch(`${process.env.REACT_APP_API_URL}/profilepicture?user=${userData?.TwitchName}`);
					}
					const profilePicture = await profilePictureResponse.json();
					firebase.db.collection("Streamers").doc(firebaseUserId).update({
						profilePicture,
					});
				} catch (err) {
					console.log(err.message);
				}
			}
		})();
	}, [firebaseInit, setUserId, firebaseUserId, firebaseUser]);

	return firebaseInit !== false && !codeArray.has("code") ? (
		<Router>
			<QueryParamProvider ReactRouterRoute={Route}>
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
				</div>
				<Banner message="DisStreamChat is in early alpha and we would like your help to test it">
					<A newTab href="https://api.disstreamchat.com/discord">
						<Button className="banner-button">Join the Discord</Button>
					</A>
				</Banner>
			</QueryParamProvider>
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
