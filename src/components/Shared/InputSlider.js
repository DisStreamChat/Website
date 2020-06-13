import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";

const useStyles = makeStyles({
	root: {
		width: 250,
		marginLeft: 15,
	},
	input: {
        color: "white",
        borderBottom: "1px solid white",
    },
});

const PrettoSlider = withStyles({
	root: {
		color: "#52af77",
		height: 8,
	},
	thumb: {
		height: 16,
		width: 16,
		backgroundColor: "#fff",
		border: "2px solid currentColor",
		marginTop: -6,
		// marginLeft: -10,
		"&:focus, &:hover, &$active": {
			boxShadow: "inherit",
		},
	},
	active: {},
	valueLabel: {
		left: "calc(-50% - 4px)",
	},
	track: {
		height: 4,
		borderRadius: 4,
	},
	rail: {
		height: 4,
		borderRadius: 4,
	},
})(Slider);

const InputSlider = props => {
	const classes = useStyles();
	const [value, setValue] = useState(props.defaultValue);

	const handleSliderChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleInputChange = event => {
		setValue(event.target.value === "" ? "" : Number(event.target.value));
    };
    
    useEffect(() => {
        if(props.value){
            setValue(props.value)
        }
    }, [props])

	const handleBlur = () => {
		if (value < props.min) {
			setValue(props.min);
		} else if (value > props.max) {
			setValue(props.max);
		}
	};

	return (
		<div className={classes.root}>
			<Typography id="input-slider" gutterBottom>
				{props.name}
			</Typography>
			<Grid container spacing={2} alignItems="center">
				<Grid item xs>
					<PrettoSlider
						valueLabelDisplay="auto"
						value={typeof value === "number" ? value : 0}
						onChange={props.onSliderChange}
						aria-labelledby="input-slider"
						min={props.min}
                        max={props.max}
                        step={props.step||1}
                        
					/>
				</Grid>
				<Grid item>
					<Input
						className={classes.input}
						value={value}
						margin="dense"
						onChange={props.onInputChange}
						onBlur={handleBlur}
						inputProps={{
							step: props.step || 1,
							min: props.min,
							max: props.max,
							type: "number",
							"aria-labelledby": "input-slider",
						}}
					/>
				</Grid>
			</Grid>
		</div>
	);
}

export default InputSlider