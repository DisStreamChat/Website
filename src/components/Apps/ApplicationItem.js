import React from 'react';
import { Link } from 'react-router-dom';

const ApplicationItem = props => {
    return (
        <li htmlFor={props.title} className="application-item">
            <div className="application--title">{props.title}</div>
            <div className="application--subtitle">{props.subtitle}</div>
            <img className="application--image" src={props.displayImage} alt=""></img>
            <Link to={`/apps/${props.pageLink}`}>Get The App</Link>
            <div>{props.description}</div>
        </li>
    );
}

export default ApplicationItem;
