import React from "react";
import "./PlatformItem.scss"
import { Button } from "@material-ui/core";

const PlatformItem = props => {
	return (
		<li className={`platform-item ${props?.title?.toLowerCase()}`}>
			<div className="title">
                <div className="logo">
				    {props.logo}
                </div>
				{props.title}
			</div>
			<Button className="connect-button" disabled={props.connected}>Connect{props.connected ? "ed" : ""}</Button>
		</li>
	);
};

export default PlatformItem;
