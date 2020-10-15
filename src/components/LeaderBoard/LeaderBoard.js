import React, { useState, useEffect } from "react";
import firebase from "../../firebase";
import { useParams } from "react-router";
import SmallLoader from "../Shared/SmallLoader";
import LeaderBoardCard from "./LeaderBoardCard";
import "./LeaderBoard.scss";
import { useDocumentOnce } from "react-firebase-hooks/firestore";
import { useQueryParam, NumberParam, StringParam } from "use-query-params";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const defaultPageSize = 50;

const LeaderBoard = ({ history }) => {
	const [leaderBoardInfo, setLeaderBoardInfo] = useState([]);
	const [guildInfo, setGuildInfo] = useState({});
	const { id } = useParams();
	const [fullLoading, setFullLoading] = useState(true);
	const [hasMore, setHasMore] = useState();
	const [page, setPage] = useQueryParam("page", NumberParam);
	const [pageSize, setPageSize] = useQueryParam("page-size", NumberParam);

	const [rawLeaderBoardData, loading, error] = useDocumentOnce(firebase.db.collection("Leveling").doc(id));

	const location = useLocation();

	useEffect(() => {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100)
	}, [location]);

	useEffect(() => {
		(async () => {
            setFullLoading(true)
			if (loading) return;
			const data = rawLeaderBoardData.data();
			if (!data) {
				history.push("/");
			}
			const leaderBoardData = Object.keys(data || {})
				.filter(key => data[key].xp)
				.sort((a, b) => data[b].xp - data[a].xp)
				.slice(((page || 1) - 1) * (pageSize || defaultPageSize), (page || 1) * (pageSize || defaultPageSize));
			const leaderBoardDashBoard = await Promise.all(
				leaderBoardData.map(async id => {
					const response = await fetch(`${process.env.REACT_APP_API_URL}/resolveuser?user=${id}&platform=discord`);
					return { ...(await response.json()), ...data[id] };
				})
			);
			setFullLoading(loading);
			setLeaderBoardInfo(leaderBoardDashBoard);
			setHasMore( Object.keys(data || {}).length > (page || 1) * (pageSize || defaultPageSize));
			try {
				const guildResponse = await fetch(`${process.env.REACT_APP_API_URL}/resolveguild?guild=${id}`);
				const guildJson = await guildResponse.json();
				setGuildInfo(prev => guildJson || prev);
			} catch (err) {}
		})();
	}, [id, rawLeaderBoardData, loading, history, page, pageSize]);


	return (
		<div className="leaderboard">
			<SmallLoader loaded={!fullLoading && !error} />
			{error && <h1>There was an error loading the leaderboard</h1>}
			<div className="leaderboard-header">
				<img src={guildInfo.iconURL} alt="" />
				<h1>{guildInfo.name}</h1>
			</div>
			{!fullLoading && (
				<div className="leaderboard-body">
					<ul>
						{leaderBoardInfo.map((user, idx) => (
							<LeaderBoardCard key={user.id} place={idx + 1 + ((page || 1) - 1) * (pageSize || defaultPageSize)} {...user} />
						))}
					</ul>
					<div className="leaderboard-footer">
						{!!(page - 1) && (
							<Link to={`/leaderboard/${id}?page=${(page || 1) - 1}&page-size=${pageSize || defaultPageSize}`}>Previous Page</Link>
						)}
						{hasMore && <Link to={`/leaderboard/${id}?page=${(page || 1) + 1}&page-size=${pageSize || defaultPageSize}`}>Next Page</Link>}
					</div>
				</div>
			)}
		</div>
	);
};

export default LeaderBoard;
