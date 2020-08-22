import React from 'react';

const LeaderBoardCard = ({place, level, xp, username, displayAvatarURL}) => {
    return (
        <div className="leaderboard-item">
            <span className={`place-card`}>{place}</span>
            <img src={displayAvatarURL} alt=""/>
            {username}
        </div>
    );
}

export default LeaderBoardCard;
