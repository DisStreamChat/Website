import React, { useState } from "react";
import "./PluginCard.scss";
import Modal from "react-modal";
import { useCallback } from "react";

Modal.setAppElement("#root");

const PluginCard = props => {
    const [modalOpen, setModalOpen] = useState(false);
    
    const handleClick = useCallback(() => {
        if(!props.active){
            setModalOpen(true)
        }
    }, [props])

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
                </div>
                <div className="bottom-buttons"></div>
            </Modal>
			<div onClick={handleClick} className={`plugin-card ${props.active ? "active" : "disabled"} ${props.comingSoon ? "coming-soon" : ""}`}>
				<div className="image">
					<img src={props.image} alt="" />
				</div>
				<div className="text">
					<h2>{props.title}</h2>
					<h4>{props.description}</h4>
				</div>
			</div>
		</>
	);
};

export default PluginCard;
