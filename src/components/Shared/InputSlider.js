import React, { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Input from "@material-ui/core/Input";

const useStyles = makeStyles({
	root: {
		width: 250,
		marginLeft: 8,
	},
	input: {
        color: "white",
        borderBottom: "1px solid white",
        marginBottom: 8,
    },
});

const PrettoSlider = withStyles({
	root: {
		color: "#fff",
        height: 8,
        marginBottom: 16,
        paddingTop: 4,
        boxSizing: "content-box"
	},
	thumb: {
		height: 24,
		width: 24,
		backgroundColor: "#fff",
		border: "4px solid #2D688D",
		marginTop: 0,
		"&:focus, &:hover, &:active": {
			boxShadow: "inherit",
		},
	},
	active: {},
	valueLabel: {
        color: "black",
		left: "calc(-50% - 4px)",
	},
	track: {
		height: 24,
        borderRadius: 24,
        paddingRight: 12,
        boxSizing: "content-box !important"
	},
	rail: {
        overflow: "hidden",
		height: 24,
		borderRadius: 24,
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