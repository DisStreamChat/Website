import React, { useEffect, useState, useCallback} from 'react';
import { NavLink, Route, Redirect, Switch, Link} from "react-router-dom"
import firebase from "../../firebase"
import "./Users.css"
import Select from 'react-select'
import chroma from 'chroma-js';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
import Zoom from '@material-ui/core/Zoom';
import Setting from "./Setting"
import useFetch from "../../hooks/useFetch"
import SmallLoader from "../Shared/SmallLoader"

const GuildIcon = props => {
    return props.icon ? <img style={{ minWidth: props.size, height: props.size, borderRadius: "50%", marginRight: "1rem" }} alt="" src={`https://cdn.discordapp.com/icons/${props.id}/${props.icon}`}></img>
        : 
        <span className="no-icon" style={{ minWidth: props.size, height: props.size, borderRadius: "50%", marginRight: "1rem", backgroundColor: "#36393f" }}>{props.name.split(" ").map(w => w[0])}</span>
}

const defaults = {
    TwitchColor: "#462b45",
    YoutubeColor: "#c4302b",
    discordColor: "#2d688d",
    highlightedMessageColor: "#6e022e"
}

const colourStyles = {
    container: styles => ({ ...styles, width: "50%", minHeight: 50}),
    control: styles => ({ ...styles, backgroundColor: "#17181b", color: "white", minHeight: 50}),
    valueContainer: styles => ({...styles, minHeight: 50}),
    menu: styles => ({ ...styles, backgroundColor: "#17181b"}),
    multiValue: styles => ({...styles, backgroundColor: chroma("#17181b").brighten(1).css(), color: "white"}),
    multiValueLabel: (styles) => ({
        ...styles,
        color: "white",
    }),
    multiValueRemove: (styles) => ({
        ...styles,
        color: "white",
    }),
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
    if(!guild) return
    const size = 40
    return {
        value: guild.name,
        label: <span style={{height: size}}>
            <GuildIcon size={size} {...guild}/>
            {guild.name}
        </span>
    }
}

const Dashboard = props => {
    // useTitle("DisTwitchChat - Dashboard")
    const [discordInfo, setDiscordInfo] = useState()
    const [selectedGuild, setSelectedGuild] = useState()
    const [selectedChannel, setSelectedChannel] = useState()

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
        (async () => {
            const unsub = firebase.db.collection("Streamers").doc(id).onSnapshot(async snapshot => {
                const data = snapshot.data()
                if (data) {
                    setOverlaySettings(data.overlaySettings)
                    setAppSettings(data.appSettings)
                    const channels = data.liveChatId
                    const channelData = channels instanceof Array ? channels : [channels]
                    const resolveChannel = async channel => {
                        return sendRequest(`https://api.distwitchchat.com/resolvechannel?guild=${data.guildId}&channel=${channel}`)
                    }
                    setSelectedChannel({guild: data.guildId, channels: (await Promise.all(channelData.map(resolveChannel))).filter(c => !!c)})
                }
            })
            return unsub
        })()
    }, [id, props.history, sendRequest])


    useEffect(() => {
        firebase.db.collection("Streamers").doc(currentUser.uid).collection("discord").onSnapshot(snapshot => {
            setDiscordInfo(snapshot.docs.map(doc => doc.data())[0])
        })
    }, [currentUser])

    const Connectguild = useCallback(async () => {
        firebase.db.collection("Streamers").doc(id).update({
            guildId: selectedGuild.id,
            liveChatId: []
        })
    }, [selectedGuild, id])

    const onGuildSelect = useCallback(async e => {
        const name = e.value
        const guildByName = discordInfo.guilds.filter(guild => guild.name === name)[0]
        const guildId = guildByName.id
        const response = await sendLoadingRequest("https://api.distwitchchat.com/ismember?guild="+guildId)
        const isMember = response.result
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
                                            value={guildOption(selectedGuild)}
                                            onChange={onGuildSelect}
                                            placeholder="Select Guild"
                                            options={discordInfo.guilds
                                                .filter(guild => guild.permissions.includes("MANAGE_GUILD"))
                                                .map(guildOption)}
                                            styles={colourStyles}
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
                                                    <a href={`https://discord.com/api/oauth2/authorize?client_id=702929032601403482&permissions=8&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F%3Fdiscord%3Dtrue&scope=bot&guild_id=${selectedGuild.id}`}><button className="invite-link discord-settings-button">Invite it</button></a>
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
                                                            styles={colourStyles}
                                                            isMulti
                                                        />
                                                    </>
                                                    :
                                                    <>
                                                        <span>This channel is not connected to your account</span>
                                                        <Tooltip TransitionComponent={Zoom} arrow title="this will remove the previously connected channel" placement="top">
                                                            <button onClick={Connectguild} className="discord-settings-button connect-button">Connect it</button>
                                                        </Tooltip>
                                                    </>
                                                }
                                                </>
                                            }   
                                            </>
                                        }
                                    </div>
                                </>
                            :
                                "discord not linked"
                            }
                        </div>
                    </Route>
                    <Route path={`${props.match.url}/overlaysettings`}>
                        <h1>Overlay Settings</h1>
                        <h3>Adjust the settings of your overlay. if you don't use the but want to you can start using it <Link className="ul bld" to="/apps">here</Link></h3>
                        <hr />
                        {Object.entries(overlaySettings || {}).sort().sort((a, b) => typeof a[1] === "boolean" ? -1 : 1).map(([key, value]) => (
                            <Setting value={value} name={key} type={typeof value !== "boolean" ? "color" : "boolean"}/>
                        ))}
                    </Route>
                    <Route path={`${props.match.url}/appsettings`}>
                        <h1>App Settings</h1>
                        <h3>Adjust the distwitchchat overlay</h3>
                        <hr />
                        {Object.entries(appSettings || {}).sort().sort((a, b) => typeof a[1] === "boolean" ? -1 : 1).map(([key, value]) => {
                            return !["showHeader", "showSourceButton"].includes(key) && <Setting value={value} name={key} type={typeof value !== "boolean" ? "color" : "boolean"} />
                        })}        
                    </Route>
                    <Redirect to={`${props.match.url}/appsettings`}/>
                </Switch>
            </div>
        </div>
    );
}

export default Dashboard;