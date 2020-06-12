import React, { useState } from "react";
import { ChromePicker } from "react-color";
import { useEffect } from "react";
import { Switch } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { blueGrey } from "@material-ui/core/colors";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import "./Users.css";
import Button from "@material-ui/core/Button";
import chroma from "chroma-js";
import InputSlider from "../Shared/InputSlider"

const FancySwitch = withStyles({
	root: {
		padding: 7,
	},
	thumb: {
		width: 24,
		height: 24,
		backgroundColor: "#fff",
		boxShadow:
			"0 0 12px 0 rgba(0,0,0,0.08), 0 0 8px 0 rgba(0,0,0,0.12), 0 0 4px 0 rgba(0,0,0,0.38)",
	},
	switchBase: {
		color: "rgba(0,0,0,0.38)",
		padding: 7,
	},
	track: {
		borderRadius: 20,
		backgroundColor: blueGrey[300],
	},
	checked: {
		"& $thumb": {
			backgroundColor: "#fff",
		},
		"& + $track": {
			opacity: "1 !important",
		},
	},
	focusVisible: {},
})(Switch);

const Setting = props => {
	const [value, setValue] = useState(props.value);
	const [open, setOpen] = useState(props.open);
	const changeHandler = v => {
		props.onChange(props.index, props.name, v);
	};

	useEffect(() => {
		if (props.type === "color") {
			setValue(props.value || props.default);
		} else {
			setValue(props.value);
		}
	}, [props]);

	const buttonStyles = {
		backgroundColor: props.default,
		color:
			chroma.contrast(chroma(props.default || "#000"), "white") > 2
				? "white"
				: "black",
	};

	return (
		<div
			className={`setting ${props.type === "color" && "color-setting"} ${
				props.open && "open"
			}`}
		>
			{props.type === "color" ? (
				<>
					<div
						className="color-header"
						onClick={() => props.onClick(props.name)}
					>
						<span>
							<KeyboardArrowDownIcon
								className={`${
									props.open ? "open" : "closed"
								} mr-quarter`}
							/>
							<h3>{props.name}</h3>
						</span>
						<span>
							<div
								className="color-preview"
								style={{
									background: value || "#000",
								}}
							></div>
						</span>
					</div>
					<ChromePicker
						color={value}
						onChange={color => changeHandler(color.hex)}
						disableAlpha
						className="ml-1"
					/>
					<Button
						variant="contained"
						className="reset-button"
						style={buttonStyles}
						onClick={() => changeHandler(props.default)}
						color="primary"
					>
						Reset
					</Button>
				</>
			) : props.type == "boolean" ? (
				<span className="checkbox-setting">
					<FormControlLabel
						control={
							<FancySwitch
								color="primary"
								checked={value}
								onChange={e => changeHandler(e.target.checked)}
								name={props.name}
							/>
						}
						label={props.name}
					/>
				</span>
			) : (
				<span className="number-setting">
					<FormControlLabel
						control={
							<InputSlider
								color="primary"
                                value={value}
                                min={0}
                                max={1000}
                                onSliderChange={(e, value) => changeHandler(value)}
                                onInputChange={event => {
		                            changeHandler(
										event.target.value === ""
											? ""
											: Number(event.target.value)
									);
                                }}
								name={props.name}
							/>
						}
					/>
				</span>
			)}
		</div>
	);
};

export default Setting;
