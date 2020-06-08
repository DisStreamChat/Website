import React, { useEffect, useState, useCallback} from 'react';
import {useTitle} from "react-use"
import { useParams, NavLink, Route, Redirect, Switch} from "react-router-dom"
import firebase from "../../firebase"
import Setting from './Setting';
import "./Users.css"
import Select from 'react-select'
import chroma from 'chroma-js';

const defaults = {
    TwitchColor: "#462b45",
    YoutubeColor: "#c4302b",
    discordColor: "#2d688d",
    highlightedMessageColor: "#6e022e"
}

const colourStyles = {
    container: styles => ({ ...styles, width: "50%", height: 50 }),
    control: styles => ({ ...styles, backgroundColor: "#17181b", color: "white", height: 50}),
    valueContainer: styles => ({...styles, height: 50}),
    menu: styles => ({ ...styles, backgroundColor: "17181b"}),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = chroma("#17181b");
        return {
            ...styles,
            backgroundColor: isDisabled
                ? null
                : isSelected
                    ? color.brighten(.6).css()
                    : isFocused
                        ? color.brighten(.6).css()
                        : color.css(),
            color: isDisabled ? '#ccc' : chroma.contrast(color, 'white') > 2? 'white': 'black',
            cursor: isDisabled ? 'not-allowed' : 'default',

            ':active': {
                ...styles[':active'],
                backgroundColor: !isDisabled && (isSelected ? data.color : color.brighten(1).css()),
            },
        };
    },
    singleValue: styles => ({...styles, color: "white"})
};

const guildOption = guild => {
    const size = 40
    return {
        value: guild.name,
        label: <span style={{height: size}}>
            {guild.icon ?
                <img style={{ width: size, borderRadius: "50%", marginRight: "1rem" }} alt="" src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}`}></img>
                :
                <span className="no-icon" style={{ width: size, height: size, borderRadius: "50%", marginRight: "1rem", backgroundColor: "#36393f"}}>{guild.name.split(" ").map(w => w[0])}</span>
            }
            {guild.name}
        </span>
    }
}

const Dashboard = props => {
    // useTitle("DisTwitchChat - Dashboard")
    const [discordInfo, setDiscordInfo] = useState()
    const [selectedGuild, setSelectedGuild] = useState()

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
            const unsub = firebase.db.collection("Streamers").doc(id).onSnapshot(snapshot => {
                const data = snapshot.data()
                if (data) {
                    console.log(data)
                    setOverlaySettings(data.overlaySettings)
                    setAppSettings(data.appSettings)
                }
            })
            return unsub
        })()
    }, [id, props.history])

    useEffect(() => {
        firebase.db.collection("Streamers").doc(currentUser.uid).collection("discord").onSnapshot(snapshot => {
            setDiscordInfo(snapshot.docs.map(doc => doc.data())[0])
            console.log(snapshot.docs.map(doc => doc.data())[0])
        })
    }, [currentUser])

    const onGuildSelect = useCallback(e => {
        const name = e.value
        const guildByName = discordInfo.guilds.filter(guild => guild.name === name)[0]
        console.log(guildByName)
        setSelectedGuild(e.value)
    })

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
                                <>
                                    <div className="discord-header">
                                            <Select
                                                onChange={onGuildSelect}
                                                placeholder="Select Guild"
                                                options={discordInfo.guilds
                                                    .filter(guild => guild.permissions.includes("MANAGE_GUILD"))
                                                    .map(guildOption)}
                                                styles={colourStyles}
                                            >

                                            </Select>
                                        <span>
                                            <img className="discord-profile" src={discordInfo.profilePicture} alt="" />
                                            <span className="discord-name">{discordInfo.name}</span>
                                        </span>
                                                
                                    </div>
                                    <div className="discord-body">
                                        {JSON.stringify(discordInfo.guilds.filter(guild => guild.name === selectedGuild)[0], null, 4)}
                                    </div>
                                </>
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
