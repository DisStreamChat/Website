import React, { useState, useEffect } from "react";
import firebase from "../../firebase";
import { useParams } from "react-router";
import SmallLoader from "../Shared/SmallLoader";
import LeaderBoardCard from "./LeaderBoardCard";
import "./LeaderBoard.scss";

const LeaderBoard = () => {
	const [leaderBoardInfo, setLeaderBoardInfo] = useState([]);
	const [guildInfo, setGuildInfo] = useState({
		iconUrl: "https://cdn.discordapp.com/icons/711238743213998091/0abf1a3a68c1be1c4ccde1e208d1e2db.jpg",
		name: "DisStreamChat Community",
	});
	const { id } = useParams();

	useEffect(() => {
		(async () => {
			const data = (await firebase.db.collection("Leveling").doc(id).get()).data();
			const leaderBoardData = Object.keys(data)
				.filter(key => data[key].xp)
				.sort((a, b) => data[b].xp - data[a].xp);
			const leaderBoardUsers = await Promise.all(
				leaderBoardData.map(async id => {
					const response = await fetch(`${process.env.REACT_APP_API_URL}/resolveuser?user=${id}&platform=discord`);
					return { ...(await response.json()), ...data[id] };
				})
			);
			setLeaderBoardInfo(leaderBoardUsers);
			// console.log(leaderBoardUsers)
		})();
	}, [id]);

	return (
		<div className="leaderboard">
			<div className="leaderboard-header">
				<img src={guildInfo.iconUrl} alt="" />
				<h1>{guildInfo.name}</h1>
			</div>
			<div className="leaderboard-body">
				<SmallLoader loaded={leaderBoardInfo.length} />
				<ul>
					{leaderBoardInfo.map((user, idx) => (
						<LeaderBoardCard place={idx + 1} {...user} />
					))}
				</ul>
			</div>
		</div>
	);
};

export default LeaderBoard;
