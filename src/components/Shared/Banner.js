import React, { useState } from "react";
import "./Banner.scss";
import { CSSTransition } from "react-transition-group";
import {Button} from "@material-ui/core"

const Banner = props => {
	const [open, setOpen] = useState(true);

	return (
		<CSSTransition in={open} unmountOnExit timeout={200} classNames="banner-node">
			<div className="banner">
                <div className="message">
                    {props.message}
                </div>
                <div className="banner-buttons">
                    {props.children}
                    <Button onClick={() => setOpen(false)} className="banner-button">
                        Close
                    </Button>
                </div>
            </div>
		</CSSTransition>
	);
};

export default Banner;
