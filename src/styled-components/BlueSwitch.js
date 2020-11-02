import Switch from "@material-ui/core/Switch";
import { withStyles } from "@material-ui/core/styles";


const BlueSwitch = withStyles({
	switchBase: {
		color: "#84b7d7",
		"&$checked": {
			color: "#2d688d",
		},
		"&$checked + $track": {
			backgroundColor: "#2d688d",
		},
	},
	checked: {},
	track: {},
})(Switch);

export default BlueSwitch;
