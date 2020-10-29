import React from "react";
import chroma from "chroma-js";

export const defaults = {
	TwitchColor: "#462b45",
	YoutubeColor: "#c4302b",
	DiscordColor: "#2d688d",
	HighlightedMessageColor: "#6e022e",
};

export const types = {
	ShowNameColors: "boolean",
	DiscordColor: "color",
	TwitchColor: "color",
	YoutubeColor: "color",
	HighlightedMessageColor: "color",
	CompactMessages: "boolean",
	MessageLimit: "number",
	DisplayPlatformColors: "boolean",
	DisplayPlatformIcons: "boolean",
	ShowHeader: "boolean",
	ShowBorder: "boolean",
	ClickthroughOpacity: "number",
};

