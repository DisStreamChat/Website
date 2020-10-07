import React, { useEffect, useState, useCallback, useContext } from "react";
import { NavLink, Route, Redirect, Switch } from "react-router-dom";
import firebase from "../../firebase";
import "./Dashboard.scss";
import A from "../Shared/A";
import SettingBox from "./Settings/SettingBox";
import { AppContext } from "../../contexts/Appcontext";
import DiscordPage from "./Discord/DiscordPage";
import AccountSettings from "./Account/Account"

const Dashboard = props => {
	const [overlaySettings, setOverlaySettings] = useState();
	const [appSettings, setAppSettings] = useState();
	const [defaultSettings, setDefaultSettings] = useState();
	const { currentUser } = useContext(AppContext);
	const id = firebase.auth.currentUser.uid;

	useEffect(() => {
		(async () => {
			const settingsRef = await firebase.db.collection("defaults").doc("settings15").get();
			const settingsData = settingsRef.data().settings;
			setDefaultSettings(settingsData);
		})();
	}, []);

	const updateAppSetting = useCallback(
		async (name, value) => {
			const copy = { ...appSettings };
			copy[name] = value;
			setAppSettings(copy);
			const userRef = firebase.db.collection("Streamers").doc(id);
			await userRef.update({
				appSettings: copy,
			});
		},
		[appSettings, id]
	);

	// const updateOverlaySetting = useCallback(
	// 	async (name, value) => {
	// 		const copy = { ...overlaySettings };
	// 		copy[name] = value;
	// 		setOverlaySettings(copy);
	// 		const userRef = firebase.db.collection("Streamers").doc(id);
	// 		await userRef.update({
	// 			overlaySettings: copy,
	// 		});
	// 	},
	// 	[overlaySettings, id]
	// );

	useEffect(() => {
		(async () => {
			if (currentUser) {
				setOverlaySettings(currentUser.overlaySettings);
				setAppSettings(currentUser.appSettings);
			}
		})();
	}, [currentUser]);

	return (
		<div className="settings-container">
			<div className="setting-options">
				<NavLink className="setting-link" activeClassName="active" to={`${props.match.url}/appsettings`}>
					App Settings
				</NavLink>
				{/* <NavLink className="setting-link" activeClassName="active" to={`${props.match.url}/overlaysettings`}>
					overlay Settings
				</NavLink> */}
				<NavLink className="setting-link" activeClassName="active" to={`${props.match.url}/discord`}>
					Discord Settings
				</NavLink>
				<NavLink className="setting-link" activeClassName="active" to={`${props.match.url}/account`}>
					Account Settings
				</NavLink>
			</div>
			<div className="settings">
				<Switch>
					<Route path={`${props.match.url}/account`} component={AccountSettings}></Route>
					<Route path={`${props.match.url}/discord`} component={DiscordPage}></Route>
					{/* <Route path={`${props.match.url}/overlaysettings`}>
						<SettingBox
							title="Overlay Settings"
							subtitle={
								<>
									Adjust the settings of your overlay. if you don't use the overlay but want to you can start using it{" "}
									<A className="ul bld" href="/apps" newTab local>
										here
									</A>
								</>
							}
							path="overlaysettings"
							parenturl={props.match.url}
							defaultSettings={defaultSettings}
							settings={overlaySettings}
							updateSettings={updateOverlaySetting}
						/>
					</Route> */}
					<Route path={`${props.match.url}/appsettings`}>
						<SettingBox
							title="App Settings"
							subtitle={
								<>
									Adjust the settings of your app. if you don't use the app but want to you can start using it{" "}
									<A className="ul bld" href="/apps" newTab local>
										here
									</A>
								</>
							}
							path="appsettings"
							parenturl={props.match.url}
							defaultSettings={defaultSettings}
							settings={appSettings}
							updateSettings={updateAppSetting}
							app
						/>
					</Route>
					<Redirect to={`${props.match.url}/appsettings`} />
				</Switch>
			</div>
		</div>
	);
};

export default Dashboard;
