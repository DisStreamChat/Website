import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";
import PrettoSlider from "../../styled-components/PrettoSlider"

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


const InputSlider = props => {
	const classes = useStyles();
	const [value, setValue] = useState(props.defaultValue);

	// const handleSliderChange = (event, newValue) => {
	// 	setValue(newValue);
	// };

	// const handleInputChange = event => {
	// 	setValue(event.target.value === "" ? "" : Number(event.target.value));
	// };

	useEffect(() => {
		if (props.value) {
			setValue(props.value);
		}
	}, [props]);

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
						// valueLabelDisplay="auto"
						value={typeof value === "number" ? value : 0}
						onChange={props.onSliderChange}
						aria-labelledby="input-slider"
						min={props.min}
						max={props.max}
						step={props.step || 1}
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
};

export default InputSlider;
