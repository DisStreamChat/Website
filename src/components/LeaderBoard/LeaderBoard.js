import React, {useState, useEffect, useContext} from 'react';
import firebase from "../../firebase"
import { useParams } from 'react-router';
import SmallLoader from '../Shared/SmallLoader';
import LeaderBoardCard from "./LeaderBoardCard"


const LeaderBoard = () => {
    const [leaderBoardInfo, setLeaderBoardInfo] = useState([])
    const {id} = useParams()

    useEffect(() => {
        (async () => {
            const data = (await firebase.db.collection("Leveling").doc(id).get()).data()
            const leaderBoardData = Object.keys(data).filter(key => data[key].xp).sort((a, b) => data[b].xp-data[a].xp)
            const leaderBoardUsers = await Promise.all(leaderBoardData.map(async id => {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/resolveuser?user=${id}&platform=discord`)
                return {...(await response.json()), ...data[id]}
            }))
            setLeaderBoardInfo(leaderBoardUsers)
            // console.log(leaderBoardUsers)
        })()
    }, [id])


    return (
        <div>
            <SmallLoader loaded={leaderBoardInfo.length}/>
            {leaderBoardInfo.map(user => <LeaderBoardCard {...user}/>)}
        </div>
    );
}

export default LeaderBoard;
