import React, { useEffect, useState, useCallback} from 'react';
import {useTitle} from "react-use"
import {useParams} from "react-router-dom"
import firebase from "../../firebase"
import Setting from './Setting';
import "./Users.css"

const defaults = {
    TwitchColor: "#462b45",
    YoutubeColor: "#c4302b",
    discordColor: "#2d688d",
    highlightedMessageColor: "#6e022e"
}

const Dashboard = props => {

    useTitle("DisTwitchChat - Dashboard")
    const { id } = useParams();

    const [overlaySettings, setOverlaySettings] = useState()
    const [appSettings, setAppSettings] = useState()

    const updateAppSetting = useCallback(async (name, value) => {
        const copy = {...appSettings}
        copy[name] = value
        const userRef = firebase.db.collection("Streamers").doc(id)
        await userRef.update({
            appSettings: copy
        })
    }, [appSettings, id])

    const updateOverlaySetting = useCallback(async (name, value) => {
        const copy = { ...overlaySettings }
        copy[name] = value
        const userRef = firebase.db.collection("Streamers").doc(id)
        await userRef.update({
            overlaySettings: copy
        })
    }, [overlaySettings, id])

    useEffect(() => {
        (async () => {
            try {
                // await firebase.db.collection("Streamers").doc(id).get()
                const unsub = firebase.db.collection("Streamers").doc(id).onSnapshot(snapshot => {
                    const data = snapshot.data()
                    if (data) {
                        setOverlaySettings(data.overlaySettings)
                        setAppSettings(data.appSettings)
                    }
                })
                return unsub
            } catch (err) {
                try{
                    // try to get mod info
                }catch(err2){
                    props.history.push("/")
                }
            } 
        })()
    }, [id, props.history])

    return (
        <div className="settings-container">
            <div className="setting-options">
                
            </div>
            <div className="settings">

            </div>
        {/* <div className="settings-container">
            <div className="settings">
                <h2>Chat Manager Settings</h2>
                {Object.entries(appSettings || {}).sort().sort((a, b) => typeof a[1] === "boolean" ? -1 : 1).map(([key, value]) => {
                    return !["showHeader", "showSourceButton"].includes(key) && <Setting key={key} default={defaults[key]} onChange={updateAppSetting} name={key} value={value} type={typeof value === "boolean" ? "boolean" : "color"}/>
                })}
            </div>

            <div className="settings">
            <h2>Chat Overlay Settings</h2>
                {Object.entries(overlaySettings || {}).sort().sort((a, b) => typeof a[1] === "boolean" ? -1 : 1).map(([key, value]) => {
                    return <Setting key={key} default={defaults[key]} onChange={updateOverlaySetting} name={key} value={value} type={typeof value === "boolean" ? "boolean" : "color"} />
                })}
            </div>
        </div>
        <div className="settings-container">
            <h1>Discord Settings</h1>
        </div> */}
        </div>
    );
}

export default Dashboard;
