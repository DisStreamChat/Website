import React from "react";
import "../PluginCard.scss"

const PluginCard = props => {
	return (
		<div className={`plugin-card ${props.active ? "active" : "disabled"} ${props.comingSoon ? "coming-soon" : ""}`}>
			<div className="image">
				<img src={props.image} alt="" />
			</div>
			<div className="text">
				<h2>{props.title}</h2>
				<h4>{props.description}</h4>
			</div>
		</div>
	);
};

export default PluginCard;
