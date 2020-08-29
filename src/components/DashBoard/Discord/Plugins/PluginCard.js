import React, { useState } from "react";
import "./PluginCard.scss";
import Modal from "react-modal";
import { useCallback } from "react";
import ClearTwoToneIcon from "@material-ui/icons/ClearTwoTone";
import { withRouter } from "react-router";
import A from "../../../Shared/A";

Modal.setAppElement("#root");

const PluginCard = props => {
	const [modalOpen, setModalOpen] = useState(false);

	const handleClick = useCallback(() => {
		if (!props.active) {
			setModalOpen(true);
		}
	}, [props]);

	const enable = useCallback(() => {
		props.history.push(`${props.match.url}/${props.id}`);
	}, [props]);

	return (
		<>
			<Modal
				isOpen={modalOpen}
				className="plugin-modal Modal"
				overlayClassName="plugin-overlay Modal-Overlay"
				onRequestClose={() => setModalOpen(false)}
			>
				<div className="top-portion">
					<h2>Enable Plugin: {props.title}</h2>
					<button onClick={() => setModalOpen(false)}>
						<ClearTwoToneIcon />
					</button>
				</div>
				<div className="bottom-buttons">
					<button onClick={enable} className="enable-plugin">
						Enable
					</button>
				</div>
			</Modal>
			<A href={props.active ? `${props.match.url}/leveling` : null} local>
				<div onClick={handleClick} className={`plugin-card ${props.active ? "active" : "disabled"} ${props.comingSoon ? "coming-soon" : ""}`}>
					<div className="image">
						<img src={props.image} alt="" />
					</div>
					<div className="text">
						<h2>{props.title}</h2>
						<h4>{props.description}</h4>
					</div>
				</div>
			</A>
		</>
	);
};

export default withRouter(PluginCard);
