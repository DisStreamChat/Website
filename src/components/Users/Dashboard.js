import React, { useEffect, useState, useCallback} from 'react';
import {useTitle} from "react-use"
import { useParams, NavLink, Route, Redirect, Switch} from "react-router-dom"
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

    // useTitle("DisTwitchChat - Dashboard")
    const [discordInfo, setDiscordInfo] = useState()


    const currentUser = firebase.auth.currentUser
    const id = currentUser.uid

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
                        console.log(data)
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

    useEffect(() => {
        firebase.db.collection("Streamers").doc(currentUser.uid).collection("discord").onSnapshot(snapshot => {
            setDiscordInfo(snapshot.docs.map(doc => doc.data())[0])
            console.log(snapshot.docs.map(doc => doc.data())[0])
        })
    }, [currentUser])

    return (
        <div className="settings-container">
            <div className="setting-options">
                <NavLink className="setting-link" activeClassName="active" to={`${props.match.url}/appsettings`}>App Settings</NavLink>
                <NavLink className="setting-link" activeClassName="active" to={`${props.match.url}/overlaysettings`}>overlay Settings</NavLink>
                <NavLink className="setting-link" activeClassName="active" to={`${props.match.url}/discord`}>Discord Connect</NavLink>
            </div>
            <div className="settings">
                <Switch>
                    <Route path={`${props.match.url}/discord`}>
                        <h1>Discord Connect</h1>
                        <h3>Connect your discord account to DisTwitchChat to get discord messages in your client/overlay during stream. You can only connect one server at a time but you can connect as many channels in that server</h3>
                        <hr/>
                        <div className="settings-body">
                            {discordInfo ? 
                                <div className="discord-header">
                                    <div className="guilds">

                                    </div>
                                    <span>
                                        <img className="discord-profile" src={discordInfo.profilePicture} alt="" />
                                        <span className="discord-name">{discordInfo.name}</span>
                                    </span>
                                    
                                </div>
                            :
                                "discord not linked"
                            }
                        </div>
                    </Route>
                    <Route path={`${props.match.url}/overlaysettings`}>

                    </Route>
                    <Route path={`${props.match.url}/appsettings`}>

                    </Route>
                    <Redirect to={`${props.match.url}/appsettings`}/>
                </Switch>
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
