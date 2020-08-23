import React, { useState, useEffect } from "react";
import firebase from "../../firebase";
import { useParams } from "react-router";
import SmallLoader from "../Shared/SmallLoader";
import LeaderBoardCard from "./LeaderBoardCard";
import "./LeaderBoard.scss";

const LeaderBoard = () => {
	const [leaderBoardInfo, setLeaderBoardInfo] = useState([]);
	const [guildInfo, setGuildInfo] = useState({});
	const { id } = useParams();

	useEffect(() => {
		(async () => {
			const data = (await firebase.db.collection("Leveling").doc(id).get()).data();
			const leaderBoardData = Object.keys(data || {})
				.filter(key => data[key].xp)
				.sort((a, b) => data[b].xp - data[a].xp);
			const leaderBoardUsers = await Promise.all(
				leaderBoardData.map(async id => {
					const response = await fetch(`${process.env.REACT_APP_API_URL}/resolveuser?user=${id}&platform=discord`);
					return { ...(await response.json()), ...data[id] };
				})
            );
            setLeaderBoardInfo(leaderBoardUsers);
            try{
                const guildResponse = await fetch(`${process.env.REACT_APP_API_URL}/resolveguild?guild=${id}`)
                const guildJson = await guildResponse.json()
                console.log(guildJson)
                setGuildInfo(guildJson)
            }catch(err){

            }
            
			// console.log(leaderBoardUsers)
		})();
	}, [id]);

	return (
		<div className="leaderboard">
			<div className="leaderboard-header">
				<img src={guildInfo.iconURL} alt="" />
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
