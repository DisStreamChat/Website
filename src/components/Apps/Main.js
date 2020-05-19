import React from 'react';

import "./Apps.css"
import ApplicationItem from "./ApplicationItem"

const Main = () => {
    return (
        <main className="main">
            <ul className="application-list">
                <ApplicationItem title="Chat Manager" description="" downloadLink=""></ApplicationItem>
                <ApplicationItem title="Chat Overlay" description="" downloadLink=""></ApplicationItem>
                <ApplicationItem title="QNA Manager" description="" downloadLink=""></ApplicationItem>
                <ApplicationItem title="Poll" description="" downloadLink=""></ApplicationItem>
                <ApplicationItem title="DashBoard App" description="" downloadLink=""></ApplicationItem>
            </ul>
        </main>
    );
}

export default Main;
