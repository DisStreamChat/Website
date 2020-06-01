import React, { useEffect, useState, useCallback} from 'react';
import {useTitle} from "react-use"
import { AppContext } from '../../contexts/Appcontext';
import {useParams, withRouter} from "react-router-dom"
import firebase from "../../firebase"
import Setting from './Setting';
import "./Users.css"

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

    useEffect(() => {
        (async () => {
            try {
                await firebase.db.collection("Streamers").doc(id).get()
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

    console.log(overlaySettings)

    return (
        <div className="settings-container">
            <div className="settings">
                {Object.entries(appSettings || {}).sort().sort((a, b) => typeof a[1] === "boolean" ? -1 : 1).map(([key, value]) => (
                    <Setting onChange={updateAppSetting} name={key} value={value} type={typeof value === "boolean" ? "boolean" : "color"} setter={setAppSettings}/>
                ))}
            </div>
            {overlaySettings && 
                <div className="settings">
                {Object.entries(overlaySettings || {}).sort().sort((a, b) => typeof a[1] === "boolean" ? -1 : 1).map(([key, value]) => (
                    <Setting onChange={updateAppSetting} name={key} value={value} type={typeof value === "boolean" ? "boolean" : "color"} setter={setAppSettings} />
                ))}
                </div>
            }
        </div>
    );
}

export default Dashboard;
