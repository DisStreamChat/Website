import React, { useState } from "react";
import "./PluginCard.scss";
import Modal from "react-modal";
import { useCallback } from "react";
import ClearTwoToneIcon from "@material-ui/icons/ClearTwoTone";
import { withRouter } from "react-router";
import A from "../../../Shared/A";
import firebase from "../../../../firebase"
import { useContext } from "react";
import { DiscordContext } from "../../../../contexts/DiscordContext";

Modal.setAppElement("#root");

const PluginCard = props => {
    const [modalOpen, setModalOpen] = useState(false);
    const {setActivePlugins, userConnectedGuildInfo} = useContext(DiscordContext)
    const guildId = userConnectedGuildInfo?.id;

	const handleClick = useCallback(() => {
		if (!props.active && (!props.comingSoon)) {
			setModalOpen(true);
		}
	}, [props]);

	const enable = useCallback(() => {
        setActivePlugins(prev => {
            const newPlugs = { ...prev, [props.id]: true };
            firebase.db
                .collection("DiscordSettings")
                .doc(guildId || " ")
                .update({
                    activePlugins: newPlugs,
                });
            return newPlugs;
        });
		props.history.push(`${props.match.url}/${props.id}`);
	}, [props, guildId]);

	return (
		<>
			<Modal
				isOpen={modalOpen}
				className="plugin-modal Modal"
				overlayClassName="plugin-overlay Modal-Overlay"
				onRequestClose={() => setModalOpen(false)}
			>
				<div className="top-portion">
					<h2>Enable Plugin: <u>{props.title}</u></h2>
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
			<A href={props.active ? `${props.match.url}/${props.id}` : null} local>
				<div onClick={handleClick} className={`plugin-card ${props.active ? "active" : "disabled"} ${props.comingSoon ? "coming-soon" : ""}`}>
					<div className="image">
						<img src={`${process.env.PUBLIC_URL}/${props.image}`} alt="" />
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
