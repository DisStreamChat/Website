import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../contexts/Appcontext';
import firebase from "../../firebase"
import {Link} from "react-router-dom"
import "./Users.css"
import { useEffectOnce } from 'react-use';

const ChannelItem = props => {
    return (
        <div className="channel-item">
            <div className="channel-profile-pic">
                <img src={props["profile_image_url"] || props.profilePicture} alt=""/>
            </div>
            <div className="channel-info">
                <span className="channel-name">{props.display_name || props.name}</span>
                <button disabled={!props.isMember} className="to-dashboard dashboard-button">{props.isMember ? <Link className="dashboard-link" to={`/dashboard/${(props.login || props.name).toLowerCase()}`} >{!props.moderator ? "Go To Dashboard" : "Go To ModView"}</Link> : <>This channel doesn't use DisTwitchChat</>}</button>
            </div>
        </div>
    )
}

const Channels = () => {

    const {currentUser} = useContext(AppContext)
    const [myChannel, setMyChannel] = useState()
    const [modChannels, setModChannels] = useState([])

    useEffectOnce(() => {
        setMyChannel({ name: currentUser.name, isMember: true, profilePicture: currentUser.profilePicture })
    })

    useEffectOnce(() => {
        (async () => {
            const users = (await (await firebase.db.collection("Streamers").doc("registered").get()).data()).names
            const channelsInfo = (await firebase.db.collection("Streamers").doc(firebase.auth.currentUser.uid).get()).data().ModChannels
            setModChannels(channelsInfo.map(channel => {return {...channel, modPlatform: "twitch", isMember: false}}))
        })()
    })

    return (
        <div className="my-channels">
            <h1>Your Channel</h1>
            <ChannelItem {...myChannel}/>
            <hr/>
            <h1>Channels you moderate</h1>
            {modChannels.map(channel => (
                <ChannelItem {...channel} moderator/>
            ))}
        </div>
    );
}

export default Channels;
