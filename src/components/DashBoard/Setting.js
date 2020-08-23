import React, { useState, useCallback, useEffect } from "react";
import { ChromePicker } from "react-color";
import { Switch } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { blueGrey } from "@material-ui/core/colors";
import AddIcon from "@material-ui/icons/Add";
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import Button from "@material-ui/core/Button";
import chroma from "chroma-js";
import InputSlider from "../Shared/InputSlider";
import lodash from "lodash";
import uid from "uid";
import AnimateHeight from "react-animate-height";

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
	const [addingItem, setAddingItem] = useState(false);
	const [valueToBeAdded, setValueToBeAdded] = useState();

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
			setValue(prev => {
				return props.value == undefined ? props.default : props.value;
			});
		}
	}, [props]);

	return (
		<div className={`setting ${props.type === "color" ? "color-setting" : "list-setting"} ${props.open && "open"}`}>
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
						style={{
							backgroundColor: props.default,
							color:
								chroma.contrast(chroma(typeof props.default === "string" ? props.default : "#000"), "white") > 2 ? "white" : "black",
						}}
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
			) : props.type === "list" ? (
				<>
					<span className="list-header" onClick={() => props.onClick(props.name)}>
						<KeyboardArrowDownIcon className={`${props.open ? "open" : "closed"} mr-quarter`} />
						<h3>{displayName}</h3>
					</span>
					<AnimateHeight duration={250} height={!props.open ? 0 : "auto"}>
						<div className="list-body">
							<div className="item add-item" onClick={() => setAddingItem(prev => !prev)}>
								<h3>Add Item</h3>
								<button>
									<AddIcon />
								</button>
							</div>
							{addingItem && (
								<form
									onSubmit={e => {
										e.preventDefault();
										if (!valueToBeAdded) return;
										setValue(value => {
											const newValue = [{ value: valueToBeAdded, id: uid() }, ...value];
											changeHandler(newValue);
											return newValue;
										});
										setValueToBeAdded("");
									}}
									className="item adding-item"
								>
									<input value={valueToBeAdded} onChange={e => setValueToBeAdded(e.target.value)} placeholder={props.placeholder} />
									<span className="buttons">
										<button type="subit">
											<CheckIcon />
										</button>
										<button
											onClick={() => {
												setValueToBeAdded("");
												setAddingItem(false);
											}}
										>
											<ClearIcon />
										</button>
									</span>
								</form>
							)}
							{value?.map?.(item => (
								<div className="item">
									{item.value}
									<button
										onClick={() => {
											setValue(prev => {
												const newValue = prev.filter(prevItem => prevItem.id !== item.id);
												changeHandler(newValue);
												return newValue;
											});
										}}
									>
										<ClearIcon />
									</button>
								</div>
							))}
						</div>
					</AnimateHeight>
				</>
			) : (
				<>
					<span className="color-header flex" onClick={() => props.onClick(props.name)}>
						<span>
							<KeyboardArrowDownIcon className={`${props.open ? "open" : "closed"} mr-quarter`} />
							<h3>{displayName}</h3>
						</span>
						<span>
							<h3>{value}</h3>
						</span>
					</span>
					<AnimateHeight duration={250} height={!props.open ? 0 : "auto"}>
						<div className="list-body selector">
							{props.options
								?.sort()
								?.filter(item => item !== value)
								?.map?.(item => (
									<div style={{ fontFamily: item }} className="item">
										{item}
										<button
											onClick={() => {
												setValue(prev => {
													const newValue = item;
													changeHandler(newValue);
													return newValue;
												});
											}}
										>
											<CheckIcon />
										</button>
									</div>
								))}
						</div>
					</AnimateHeight>
				</>
			)}
		</div>
	);
};

export default Setting;
