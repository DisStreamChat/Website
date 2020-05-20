import React from 'react';

import GitHubIcon from '@material-ui/icons/GitHub';
import TwitterIcon from '@material-ui/icons/Twitter';
import A from "../Shared/A"

const Member = props => {
    return (
        <div className="member">
            <A href={props.imgUrl} newTab><img className="team-picture" src={props.img} width="320" alt="" /></A>
            <h1 className="team-title">{props.name}</h1>
            <h3 className="team-sub-title">{props.title}</h3>
            <div className="socials">
                {props.socials?.map(social => (
                    <A href={social.link}>{social.icon}</A>
                ))}
            </div>
        </div>
    );
}

export default Member;
