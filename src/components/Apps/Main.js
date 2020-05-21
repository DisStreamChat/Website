import React from 'react';

import "./Apps.css"
import ApplicationItem from "./ApplicationItem"

import apps from "./Apps.json"

const Main = () => {
    return (
        <>
            <ul className="application-list">
                {apps.map(app => (
                    <ApplicationItem {...app}/>
                ))}
            </ul>
        </>
    );
}

export default Main;
