import React, { useState, useCallback, useEffect } from "react";
import { ChromePicker } from "react-color";
import { Switch } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { blueGrey } from "@material-ui/core/colors";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Button from "@material-ui/core/Button";
import chroma from "chroma-js";
import InputSlider from "../Shared/InputSlider";
import lodash from "lodash";

const FancySwitch = withStyles({
	root: {
		padding: 7,
	},
	thumb: {
		width: 24,
		height: 24,
		backgroundColor: "#fff",
		boxShadow: "0 0 12px 0 rgba(0,0,0,0.08), 0 0 8px 0 rgba(0,0,0,0.12), 0 0 4px 0 rgba(0,0,0,0.38)",
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
	const [displayName, setDisplayName] = useState();

	const changeHandler = useCallback(
		lodash.debounce(v => {
			props.onChange(props.name, v);
		}, 1000),
		[props.onChange, props.name]
	);

	useEffect(() => {
		setDisplayName(props.name.match(/[A-Z][a-z]+|[0-9]+/g).join(" "));
	}, [props.name]);

	useEffect(() => {
		if (props.type === "color") {
			setValue(props.value || props.default);
		} else {
			setValue(props.value);
		}
	}, [props]);

	const buttonStyles = {
		backgroundColor: props.default,
		color: chroma.contrast(chroma(typeof props.default === "string" ? props.default : "#000"), "white") > 2 ? "white" : "black",
	};

	return (
		<div className={`setting ${props.type === "color" ? "color-setting" : props.type === "list" ? "list-setting" : ""} ${props.open && "open"}`}>
			{props.type === "color" ? (
				<>
					<div className="color-header" onClick={() => props.onClick(props.name)}>
						<span>
							<KeyboardArrowDownIcon className={`${props.open ? "open" : "closed"} mr-quarter`} />
							<h3>{displayName}</h3>
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
						onChange={color => {
							setValue(color.hex);
							changeHandler(color.hex);
						}}
						disableAlpha
						className="ml-1"
					/>
					<Button
						variant="contained"
						className="reset-button"
						style={buttonStyles}
						onClick={() => {
							setValue(props.default);
							changeHandler(props.default);
						}}
						color="primary"
					>
						Reset
					</Button>
				</>
			) : props.type === "boolean" ? (
				<span className="checkbox-setting">
					<FormControlLabel
						control={
							<FancySwitch
								color="primary"
								checked={value}
								onChange={e => {
									setValue(e.target.checked);
									changeHandler(e.target.checked);
								}}
								name={props.name}
							/>
						}
						label={displayName}
					/>
				</span>
			) : props.type === "number" ? (
				<span className="number-setting">
					<FormControlLabel
						control={
							<InputSlider
								color="primary"
								value={value}
								min={props.min}
								max={props.max}
								step={props.step}
								onSliderChange={(e, value) => {
									setValue(value);
									changeHandler(value);
								}}
								onInputChange={event => {
									setValue(event.target.value === "" ? "" : Number(event.target.value));
									changeHandler(event.target.value === "" ? "" : Number(event.target.value));
								}}
								name={displayName}
							/>
						}
					/>
				</span>
			) : (
				<span className="color-header">
					<KeyboardArrowDownIcon className={`${props.open ? "open" : "closed"} mr-quarter`} onClick={() => props.onClick(props.name)} />
					<h3>{displayName}</h3>
				</span>
			)}
		</div>
	);
};

export default Setting;
