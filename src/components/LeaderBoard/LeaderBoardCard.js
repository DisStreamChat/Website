import React, { useState, useEffect } from "react";

const radius = 36;
const circ = 2 * Math.PI * radius

const getLevel = xp => Math.max(0, Math.floor(Math.log(xp - 100)));

const getXp = level => (5 / 6) * level * (2 * level * level + 27 * level + 91);

const map = (n, start1, stop1, start2, stop2) => ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;

const LeaderBoardCard = ({ place, level, xp, username, displayAvatarURL }) => {
	const [progression, setProgression] = useState(0);

	useEffect(() => {
		const xpThisLevel = getXp(level);
        const xpToNextLevel = getXp(level + 1);
        console.log(xpToNextLevel)
		const bigDif = Math.abs(xpThisLevel - xpToNextLevel);
		const dif = Math.abs(xpToNextLevel - xp);
		setProgression(map(dif, 0, bigDif, 0, circ));
		console.log(map(dif, 0, bigDif, circ, 0));
	}, []);

	return (
		<div className="leaderboard-item">
			<div className="user-info">
				<span className={`place-card`}>{place}</span>
				<img src={displayAvatarURL} alt="" />
				{username}
			</div>
			<div className="level-info">
				<div className="xp data">
					<span>experience</span>
					{xp > 1000 ? `${(xp / 1000).toFixed(2)}k` : xp}
				</div>
				<div className="level-data">
					<svg class="progress-ring" width="120" height="120">
						<circle
                            strokeDashoffset={progression}
                            strokeDasharray={`${circ} ${circ}`}
							class="progress-ring__circle"
							stroke="#347aa5"
							stroke-width="4"
							fill="transparent"
							r={radius}
							cx="60"
							cy="60"
						/>
					</svg>
					<span className="level data">
						<span>Level</span>
						{level+1}
					</span>
				</div>
			</div>
		</div>
	);
};

export default LeaderBoardCard;
