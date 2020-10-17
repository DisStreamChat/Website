import React, { useState, useEffect } from "react";
import firebase from "../../firebase";
import { useParams } from "react-router";
import SmallLoader from "../Shared/SmallLoader";
import LeaderBoardCard from "./LeaderBoardCard";
import "./LeaderBoard.scss";
import { useDocumentOnce, useCollectionOnce } from "react-firebase-hooks/firestore";
import { useQueryParam, NumberParam, StringParam } from "use-query-params";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { usePagination } from "use-pagination-firestore";

const defaultPageSize = 50;

const LeaderBoard = ({ history }) => {
	const [leaderBoardInfo, setLeaderBoardInfo] = useState([]);
	const [guildInfo, setGuildInfo] = useState({});
	const { id } = useParams();
	const [fullLoading, setFullLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useQueryParam("page-size", NumberParam);

	const { items, isLoading: loading, isStart, isEnd, getPrev, getNext } = usePagination(
		firebase.db.collection("Leveling").doc(id).collection("users").orderBy("xp", "desc"),
		{ limit: pageSize || defaultPageSize }
	);

	useEffect(() => {
		setTimeout(() => {
			window.scrollTo(0, 0);
		}, 100);
		(async () => {
			setFullLoading(true);
			if (loading) return;
			const leaderBoardDashBoard = items;
			setFullLoading(loading);
			setLeaderBoardInfo(leaderBoardDashBoard);
			try {
				const guildResponse = await fetch(`${process.env.REACT_APP_API_URL}/resolveguild?guild=${id}`);
				const guildJson = await guildResponse.json();
				setGuildInfo(prev => guildJson || prev);
			} catch (err) {}
		})();
	}, [id, items, loading, history, pageSize]);

	return (
		<div className="leaderboard">
			<SmallLoader loaded={!fullLoading} />
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
						{!isStart && (
							<button
								onClick={() => {
									getPrev();
									setPage(prev => prev - 1);
								}}
							>
								Previous Page
							</button>
						)}
						{!isEnd && (
							<button
								onClick={() => {
									getNext();
									setPage(prev => prev + 1);
								}}
							>
								Next Page
							</button>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default LeaderBoard;
