export const GuildIcon = props => {
	return props.icon ? (
		<img
			style={{
				minWidth: props.size,
				height: props.size,
				borderRadius: "50%",
				marginRight: "1rem",
			}}
			alt=""
			src={`https://cdn.discordapp.com/icons/${props.id}/${props.icon}`}
		></img>
	) : (
		<span
			className="no-icon"
			style={{
				maxWidth: props.size,
				minWidth: props.size,
				height: props.size,
				borderRadius: "50%",
				marginRight: "1rem",
				backgroundColor: "#36393f",
			}}
		>
			{props?.name?.split?.(" ")?.map(w => w[0])}
		</span>
	);
};

export default GuildIcon;
