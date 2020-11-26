import { useState, useEffect } from "react";
import firebase from "../../firebase";
import { useParams } from "react-router";
import SmallLoader from "../Shared/SmallLoader";
import LeaderBoardCard from "./LeaderBoardCard";
import "./LeaderBoard.scss";
import { useQueryParam, NumberParam } from "use-query-params";
import { usePagination } from "use-pagination-firestore";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import useDebounce from "../../hooks/useDebouce";

const defaultPageSize = 50;

const LeaderBoard = ({ history }) => {
	const [leaderBoardInfo, setLeaderBoardInfo] = useState([]);
	const [guildInfo, setGuildInfo] = useState({});
	const { id } = useParams();
	const [fullLoading, setFullLoading] = useState(true);
	const [page, setPage] = useState(1);
	const [pageSize] = useQueryParam("page-size", NumberParam);
	const [search, setSearch] = useState("");

	const firebaseSearch = useDebounce(search, 500);

	const {
		items,
		isLoading: loading,
		isStart,
		isEnd,
		getPrev,
		getNext,
	} = usePagination(
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
			setLeaderBoardInfo(
				items.filter(item =>
					item.name
						? item.name.toLowerCase().includes(search.toLowerCase())
						: false
				)
			);
			try {
				const guildResponse = await fetch(
					`${process.env.REACT_APP_API_URL}/resolveguild?guild=${id}`
				);
				const guildJson = await guildResponse.json();
				setGuildInfo(prev => guildJson || prev);
			} catch (err) {}
		})();
	}, [id, items, loading, history, pageSize, search]);

	return (
		<div className="leaderboard">
			<SmallLoader loaded={!fullLoading} />
			<div className="leaderboard-header">
				<div className="server-info">
					<img src={guildInfo.iconURL} alt="" />
					<h1>{guildInfo.name}</h1>
				</div>
				<span className="search-container">
					<input
						value={search}
						onChange={e => setSearch(e.target.value)}
						type="text"
						name=""
						id=""
						placeholder="Search"
						className="settings--searchbox"
					/>
					<ClearRoundedIcon className="clear-button" onClick={() => {}} />
				</span>
			</div>
			{!fullLoading && (
				<div className="leaderboard-body">
					<ul>
						{leaderBoardInfo.map((user, idx) => (
							<LeaderBoardCard
								guild={id}
								key={user.name}
								place={idx + 1 + ((page || 1) - 1) * (pageSize || defaultPageSize)}
								{...user}
							/>
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
