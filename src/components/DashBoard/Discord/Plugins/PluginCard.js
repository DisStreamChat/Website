import { memo, useEffect, useState, useContext } from "react";
import "./PluginCard.scss";
import { withRouter } from "react-router";
import A from "../../../Shared/A";
import firebase from "../../../../firebase";
import { DiscordContext } from "../../../../contexts/DiscordContext";
import BlueSwitch from "../../../../styled-components/BlueSwitch";

const PluginCard = memo(({ guild: guildId, id, active, ...props }) => {
	const { setActivePlugins, setDashboardOpen } = useContext(DiscordContext);
	const [enabled, setEnabled] = useState(true);

	useEffect(() => {
		setEnabled(!!active);
	}, [active]);

	const handleChange = e => {
		const checked = e.target.checked;
		setEnabled(checked);

		setActivePlugins(prev => {
			const newPlugs = { ...prev, [id]: checked };
			const docRef = firebase.db.collection("DiscordSettings").doc(guildId || " ");
			docRef
				.update({
					activePlugins: newPlugs,
				})
				.then(() => setDashboardOpen(true))
				.catch(err => {
					docRef.set({
						activePlugins: newPlugs,
					});
				});
			return newPlugs;
		});
	};

	return (
		<div className={`plugin-card ${props.comingSoon ? "coming-soon" : ""}`}>
			<span className="plugin-switch">
				<BlueSwitch
					checked={enabled}
					onChange={handleChange}
					color="primary"
					name={id}
					inputProps={{ "aria-label": "primary checkbox" }}
				/>
			</span>
			<A className="plugin-card-a" href={active ? `${props.match.url}/${id}` : "#"} local>
				<div className="image">
					<img src={`${process.env.PUBLIC_URL}/${props.image}`} alt="" />
				</div>
				<div className="text">
					<h2>{props.title}</h2>
					<h4>{props.description}</h4>
				</div>
			</A>
		</div>
	);
});

export default withRouter(PluginCard);
