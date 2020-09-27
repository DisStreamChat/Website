import React, { useEffect, useState, useCallback, useContext } from "react";
import firebase from "../../../../firebase";
import { DiscordContext } from "../../../../contexts/DiscordContext";
import { colorStyles } from "../../../Shared/userUtils";
import Select from "react-select";

const Leveling = ({ location }) => {
	const [loggingChannel, setLoggingChannel] = useState("");
	const [activeEvents, setActiveEvents] = useState({});
	const [allEvents, setAllEvents] = useState({});
	const { setActivePlugins, userConnectedGuildInfo } = useContext(DiscordContext);
	const guildId = userConnectedGuildInfo?.id;

	useEffect(() => {
		(async () => {})();
	}, [location, guildId]);

	return (
		<div>
			<div className="plugin-item-header">
				<span className="title">
					<img src={`${process.env.PUBLIC_URL}/clipboard.svg`} alt="" />
					<h2>Logging</h2>
				</span>
				<span className="toggle-button">
					<button
						onClick={() => {
							setActivePlugins(prev => {
								const newPlugs = { ...prev, leveling: false };
								firebase.db
									.collection("DiscordSettings")
									.doc(guildId || " ")
									.update({
										activePlugins: newPlugs,
									});
								return newPlugs;
							});
						}}
					>
						Disable
					</button>
				</span>
			</div>
			<hr />
			<div className="plugin-item-subheader">
				<h4>
					You can set a channel and events that will be sent to that particular channel. Don't miss anything happening in your server when
					you are not around!
				</h4>
				
			</div>
			<div className="plugin-item-body">
                <h4 className="plugin-section-title">Logging Channel</h4>
				<div className="plugin-section">
					
				</div>
			</div>
		</div>
	);
};

export default React.memo(Leveling);
