import { useState, useEffect } from "react";
import {getXp, map} from "../../utils/functions"

const radius = 36;
const circ = 2 * Math.PI * radius;

const LeaderBoardCard = ({ place, level, xp, name, avatar }) => {
	const [progression, setProgression] = useState(0);

	useEffect(() => {
		const xpThisLevel = getXp(level);
		const xpToNextLevel = getXp(level + 1);
		const bigDif = Math.abs(xpThisLevel - xpToNextLevel);
		const dif = Math.abs(xpToNextLevel - xp);
		setProgression(map(dif, 0, bigDif, 0, circ));
	}, [level, xp]);

	return (
		<div className="leaderboard-item" id={`place-${place}`}>
			<div className="user-info">
				<span className="place-card">{place}</span>
				<img src={avatar} alt="" />
				{name}
			</div>
			<div className="level-info">
				<div className="xp data">
					<span>experience</span>
					{xp > 1000 ? `${(xp / 1000).toFixed(2)}k` : xp}
				</div>
				<div className="level-data">
					<svg className="progress-ring" width="120" height="120">
						<circle
							strokeDashoffset={progression}
							strokeDasharray={`${circ} ${circ}`}
							className="progress-ring__circle"
							stroke="#347aa5"
							strokeWidth="4"
							fill="transparent"
							r={radius}
							cx="60"
							cy="60"
						/>
					</svg>
					<span className="level data">
						<span>Level</span>
						{level + 1}
					</span>
				</div>
			</div>
		</div>
	);
};

export default LeaderBoardCard;
