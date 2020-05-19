import React from 'react';

const ApplicationItem = props => {
    return (
        <>
        <li htmlFor={props.title} className="application-item">
            <div className="application--title">{props.title}</div>
        </li>
        </>
    );
}

export default ApplicationItem;
