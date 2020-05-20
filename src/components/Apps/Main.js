import React from 'react';

import "./Apps.css"
import ApplicationItem from "./ApplicationItem"

import apps from "./Apps.json"

const Main = () => {
    return (
        <main className="main">
            <ul className="application-list">
                {apps.map(app => (
                    <ApplicationItem {...app}/>
                ))}
            </ul>
        </main>
    );
}

export default Main;
