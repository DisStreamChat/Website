import React, { useEffect, useState, useCallback} from 'react';
import { NavLink, Route, Redirect, Switch} from "react-router-dom"
import firebase from "../../firebase"
import "./Users.css"
import Select from 'react-select'
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import Setting from "./Setting"
import useFetch from "../../hooks/useFetch"
import SmallLoader from "../Shared/SmallLoader"
import A from "../Shared/A"

import {defaults, colorStyles, guildOption} from "./userUtils"


const Dashboard = props => {
    const [discordInfo, setDiscordInfo] = useState()
    const [selectedGuild, setSelectedGuild] = useState()
    const [selectedChannel, setSelectedChannel] = useState({})
    const [displayGuild, setDisplayGuild] = useState()

    useEffect(() => {
        setDisplayGuild(guildOption(selectedGuild))
    }, [selectedGuild])

    const currentUser = firebase.auth.currentUser
    const id = currentUser.uid

    const [overlaySettings, setOverlaySettings] = useState()
    const [appSettings, setAppSettings] = useState()

    const {sendRequest} = useFetch()
    const {isLoading, sendRequest: sendLoadingRequest} = useFetch()

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
        const unsub = firebase.db.collection("Streamers").doc(id).collection("discord").doc("data").onSnapshot(snapshot => {
            const data = snapshot.data()
            if(data){
                firebase.db.collection("Streamers").doc(id).update({
                    guildId: data.connectedGuild
                })
            }
        })
        return unsub
    }, [id])

    const disconnect = useCallback(async () => {
        setSelectedGuild(null)
        firebase.db.collection("Streamers").doc(id).collection("discord").doc("data").update({
            connectedGuild: ""
        })
    }, [id])

    useEffect(() => {
        if(discordInfo){
            const unsub = firebase.db.collection("Streamers").doc(id).collection("discord").doc("data").onSnapshot(async snapshot => {
                const data = snapshot.data()
                if(data){
                    const id = data.connectedGuild
                    const guildByName = discordInfo.guilds.find(guild => guild.id === id)
                    if (guildByName) {
                        const guildId = guildByName.id
                        const { result: isMember } = await sendRequest("https://api.distwitchchat.com/ismember?guild=" + guildId)
                        const channelReponse = await sendRequest("https://api.distwitchchat.com/getchannels?guild=" + guildId)
                        setSelectedGuild({
                            name: guildByName.name,
                            isMember,
                            icon: guildByName.icon,
                            id: guildByName.id,
                            channels: channelReponse
                        })
                    } 
                }
            })
            return unsub
        }
    }, [discordInfo, id, sendRequest])

    useEffect(() => {
        (async () => {
            const user = await firebase.db.collection("Streamers").doc(id).get()
            const discord = await firebase.db.collection("Streamers").doc(id).collection("discord").doc("data").get()
            const userData = await user.data()
            const discordData = await discord.data()
            
            const channels = userData.liveChatId
            const channelData = channels instanceof Array ? channels : [channels]


            const resolveChannel = async channel => (
                sendRequest(`https://api.distwitchchat.com/resolvechannel?guild=${discordData.connectedGuild}&channel=${channel}`)
            )

            setSelectedChannel({ guild: discordData.connectedGuild, channels: (await Promise.all(channelData.map(resolveChannel))).filter(c => !!c) })

            const unsub = firebase.db.collection("Streamers").doc(id).onSnapshot(async snapshot => {
                const data = snapshot.data()
                if (data) {
                    setOverlaySettings(data.overlaySettings)
                    setAppSettings(data.appSettings)              
                }
            })
            return unsub
        })()
    }, [id, props.history, sendRequest, discordInfo])



    useEffect(() => {
        const unsub = firebase.db.collection("Streamers").doc(id).collection("discord").onSnapshot(snapshot => {
            setDiscordInfo(snapshot.docs.map(doc => doc.data())[0])
        })
        return unsub
    }, [currentUser, id])

    const Connectguild = useCallback(async () => {
        firebase.db.collection("Streamers").doc(id).collection("discord").doc("data").update({
            connectedGuild: selectedGuild.id,
        })
    }, [selectedGuild, id])

    const onGuildSelect = useCallback(async e => {
        const name = e.value
        const guildByName = discordInfo.guilds.filter(guild => guild.name === name)[0]
        const guildId = guildByName.id
        const { result: isMember } = await sendLoadingRequest("https://api.distwitchchat.com/ismember?guild="+guildId)
        const channelReponse = await sendLoadingRequest("https://api.distwitchchat.com/getchannels?guild="+guildId)
        setSelectedGuild({
            name,
            isMember,
            icon: guildByName.icon,
            id: guildByName.id,
            channels: channelReponse
        })
    }, [discordInfo, sendLoadingRequest])

    const onChannelSelect = useCallback(async e => {
        console.log(e)
        setSelectedChannel(s => ({...s, channels: e.map(c => ({id: c.value, name: c.label}))}))
        firebase.db.collection("Streamers").doc(id).update({
            liveChatId: e.map(c => c.value)
        })
    }, [id]) 

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
                                            value={displayGuild}
                                            onChange={onGuildSelect}
                                            placeholder="Select Guild"
                                            options={discordInfo.guilds
                                                .filter(guild => guild.permissions.includes("MANAGE_GUILD"))
                                                .map(guildOption)}
                                            styles={colorStyles}
                                            isDisabled={!!discordInfo.connectedGuild}
                                        />
                                        <span>
                                            <img className="discord-profile" src={discordInfo.profilePicture} alt="" />
                                            <span className="discord-name">{discordInfo.name}</span>
                                        </span>
                                                
                                    </div>
                                    <div className="discord-body">
                                        {isLoading ? 
                                            <SmallLoader/> : 
                                        selectedGuild && 
                                            <>
                                            {!selectedGuild.isMember ? 
                                                <div className="not-member">
                                                    <span className="error-color">DisTwitchBot is not a member of this server</span>
                                                    <a href={`https://discord.com/api/oauth2/authorize?client_id=702929032601403482&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F%3Fdiscord%3Dtrue&scope=bot&guild_id=${selectedGuild?.id}`}><button className="invite-link discord-settings-button">Invite it</button></a>
                                                </div>
                                                :
                                                <>
                                                {selectedGuild.id === selectedChannel.guild ? 
                                                    <>
                                                        <h3>select channels to listen to</h3>
                                                        <Select
                                                            closeMenuOnSelect={false}
                                                            onChange={onChannelSelect}
                                                            placeholder="Select Channel"
                                                            value={selectedChannel.channels.map(channel => ({value: channel.id, label: channel.name}))}
                                                            options={selectedGuild.channels.map(channel => ({value: channel.id, label: channel.name}))}
                                                            styles={colorStyles}
                                                            isMulti
                                                        />
                                                        <button onClick={disconnect} className="discord-settings-button warning-button">Disconnect</button>
                                                    </>
                                                    :
                                                    <>
                                                        <span>This channel is not connected to your account</span>
                                                        <button onClick={Connectguild} className="discord-settings-button warning-button">Connect it</button>
                                                    </>
                                                }
                                                </>
                                            }   
                                            </>
                                        }
                                    </div>
                                </>
                            :
                                <>
                                    You have not Connected your Discord Account, <A newTab href="https://discord.com/api/oauth2/authorize?client_id=702929032601403482&redirect_uri=https%3A%2F%2Fwww.distwitchchat.com%2F%3Fdiscord%3Dtrue&response_type=code&scope=identify%20connections"><button className="discord-settings-button good-button">Connect It</button></A>
                                    {/* You have not Connected your Discord Account<A newTab href="https://discord.com/api/oauth2/authorize?client_id=702929032601403482&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F%3Fdiscord%3Dtrue&response_type=code&scope=identify%20connections"><button className="discord-settings-button good-button">Connect It</button></A> */}
                                </>
                            }
                        </div>
                    </Route>
                    <Route path={`${props.match.url}/overlaysettings`}>
                        <h1>Overlay Settings</h1>
                        <h3>Adjust the settings of your overlay. if you don't use the overlay but want to you can start using it <A className="ul bld" href="/apps" newTab local>here</A></h3>
                        <hr />
                        <span className="settings-sub-body">
                            {Object.entries(overlaySettings || {}).sort().sort((a, b) => typeof a[1] === "boolean" ? -1 : 1).map(([key, value]) => (
                                <Setting default={defaults[key]} onChange={updateOverlaySetting} value={value} name={key} type={typeof value !== "boolean" ? "color" : "boolean"} />
                            ))}
                        </span>
                        
                    </Route>
                    <Route path={`${props.match.url}/appsettings`}>
                        <h1>App Settings</h1>
                        <h3>Adjust the settings of your Client. if you don't use the client but want to you can start using it <A className="ul bld" href="/apps" newTab local>here</A></h3>
                        <hr />
                        <span className="settings-sub-body">
                            {Object.entries(appSettings || {}).sort().sort((a, b) => typeof a[1] === "boolean" ? -1 : 1).map(([key, value]) => {
                                return !["showHeader", "showSourceButton"].includes(key) && <Setting default={defaults[key]} onChange={updateAppSetting} value={value} name={key} type={typeof value !== "boolean" ? "color" : "boolean"} />
                            })} 
                        </span>   
                    </Route>
                    <Redirect to={`${props.match.url}/appsettings`}/>
                </Switch>
            </div>
        </div>
    );
}

export default Dashboard;