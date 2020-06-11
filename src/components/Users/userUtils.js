import React from "react"
import chroma from 'chroma-js';


export const GuildIcon = props => {
    return props.icon ? <img style={{ minWidth: props.size, height: props.size, borderRadius: "50%", marginRight: "1rem" }} alt="" src={`https://cdn.discordapp.com/icons/${props.id}/${props.icon}`}></img>
        :
        <span className="no-icon" style={{ minWidth: props.size, height: props.size, borderRadius: "50%", marginRight: "1rem", backgroundColor: "#36393f" }}>{props.name.split(" ").map(w => w[0])}</span>
}

export const defaults = {
			TwitchColor: "#462b45",
			YoutubeColor: "#c4302b",
			DiscordColor: "#2d688d",
			HighlightedMessageColor: "#6e022e",
		};

export const colorStyles = {
    container: (styles) => ({ ...styles, width: "50%", minHeight: 50 }),
    control: (styles, {isDisabled}) => ({ ...styles, backgroundColor: isDisabled ? "black" : "#17181b", color: "white", minHeight: 50, opacity: isDisabled ? 0.5 : 1}),
    valueContainer: styles => ({ ...styles, minHeight: 50 }),
    menu: styles => ({ ...styles, backgroundColor: "#17181b" }),
    multiValue: styles => ({ ...styles, backgroundColor: chroma("#17181b").brighten(1).css(), color: "white" }),
    multiValueLabel: (styles) => ({
        ...styles,
        color: "white",
    }),
    multiValueRemove: (styles) => ({
        ...styles,
        color: "white",
    }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = chroma("#17181b");
        return {
            ...styles,
            backgroundColor: isDisabled
                ? null
                : isSelected
                    ? color.brighten(.6).css()
                    : isFocused
                        ? color.brighten(.6).css()
                        : color.css(),
            color: isDisabled ? '#ccc' : chroma.contrast(color, 'white') > 2 ? 'white' : 'black',
            cursor: isDisabled ? 'not-allowed' : 'default',

            ':active': {
                ...styles[':active'],
                backgroundColor: !isDisabled && (isSelected ? data.color : color.brighten(1).css()),
            },
        };
    },
    singleValue: styles => ({ ...styles, color: "white" })
};

export const guildOption = guild => {
    if (!guild) return null
    const size = 40
    return {
        value: guild.name,
        label: <span style={{ height: size }}>
            <GuildIcon size={size} {...guild} />
            {guild.name}
        </span>
    }
}