import React, { useState, useEffect } from "react";
import firebase from "../../firebase";
import { useParams } from "react-router";
import SmallLoader from "../Shared/SmallLoader";
import LeaderBoardCard from "./LeaderBoardCard";
import "./LeaderBoard.scss";
import { useDocumentOnce } from "react-firebase-hooks/firestore";

const LeaderBoard = ({ history }) => {
	const [leaderBoardInfo, setLeaderBoardInfo] = useState([]);
	const [guildInfo, setGuildInfo] = useState({});
	const { id } = useParams();
	const [rawLeaderBoardData, loading, error] = useDocumentOnce(firebase.db.collection("Leveling").doc(id));

	useEffect(() => {
		(async () => {
			if (loading) return;
			const data = rawLeaderBoardData.data();
			if (!data) {
				history.push("/");
			}
			const leaderBoardData = Object.keys(data || {})

				.filter(key => data[key].xp)
				.sort((a, b) => data[b].xp - data[a].xp)
				.slice(0, 101);
			const leaderBoardDashBoard = await Promise.all(
				leaderBoardData.map(async id => {
					const response = await fetch(`${process.env.REACT_APP_API_URL}/resolveuser?user=${id}&platform=discord`);
					return { ...(await response.json()), ...data[id] };
				})
			);
			setLeaderBoardInfo(leaderBoardDashBoard);
			try {
				const guildResponse = await fetch(`${process.env.REACT_APP_API_URL}/resolveguild?guild=${id}`);
				const guildJson = await guildResponse.json();
				setGuildInfo(prev => guildJson || prev);
			} catch (err) {}
		})();
	}, [id, rawLeaderBoardData, loading, history]);

	return (
		<div className="leaderboard">
			<SmallLoader loaded={!loading} />
			<div className="leaderboard-header">
				<img src={guildInfo.iconURL} alt="" />
				<h1>{guildInfo.name}</h1>
			</div>
			{!loading && (
				<div className="leaderboard-body">
					<ul>
						{leaderBoardInfo.map((user, idx) => (
							<LeaderBoardCard place={idx + 1} {...user} />
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default LeaderBoard;
