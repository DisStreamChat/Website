import chroma from "chroma-js";

export const REACTION_ROLE_ACTION_TYPES = {
	ADD_ON_ADD: "Add",
	REMOVE_ON_REMOVE: "Remove",
	ADD_ON_REMOVE: "Add (reversed)",
	REMOVE_ON_ADD: "Remove (reversed)",
	TOGGLE: "Toggle",
	TOGGLE_REVERSE: "Toggle (reversed)",
};

export const DEFAULT_COLORS = {
	TwitchColor: "#462b45",
	YoutubeColor: "#c4302b",
	DiscordColor: "#2d688d",
	HighlightedMessageColor: "#6e022e",
};

export const colorStyles = {
	container: styles => ({ ...styles, width: "80%", minHeight: 50 }),
	control: (styles, { isDisabled }) => ({
		...styles,
		backgroundColor: isDisabled ? "black" : "#17181b",
		color: "white",
		minHeight: 50,
		opacity: isDisabled ? 0.5 : 1,
	}),
	valueContainer: styles => ({ ...styles, minHeight: 50 }),
	menu: styles => ({ ...styles, backgroundColor: "#17181b" }),
	multiValue: styles => ({
		...styles,
		backgroundColor: chroma("#17181b").brighten(1).css(),
		color: "white",
	}),
	multiValueLabel: styles => ({
		...styles,
		color: "white",
	}),
	multiValueRemove: styles => ({
		...styles,
		color: "white",
	}),
	option: (styles, { data, isDisabled, isFocused, isSelected }) => {
		const color = chroma("#17181b");
		return {
			...styles,
			backgroundColor: isDisabled ? null : isSelected ? color.brighten(0.6).css() : isFocused ? color.brighten(0.6).css() : color.css(),
			color: isDisabled ? "#ccc" : chroma.contrast(color, "white") > 2 ? "white" : "black",
			cursor: isDisabled ? "not-allowed" : "default",

			":active": {
				...styles[":active"],
				backgroundColor: !isDisabled && (isSelected ? data.color : color.brighten(1).css()),
			},
		};
	},
	singleValue: styles => ({ ...styles, color: "white" }),
};
