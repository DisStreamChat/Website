import React, {useEffect, useState} from "react"
import firebase from "./firebase"
import "./App.css"
import {HashRouter as Router, Route, Redirect, Switch} from "react-router-dom"
import Home from "./components/Home/Home"
import About from "./components/About/About"
import Community from "./components/Community/Community"
import Bot from "./components/Bot/Bot"
import Apps from "./components/Apps/Main"
import Footer from "./components/Footer"
import Dashboard from "./components/Users/Dashboard"
import MyChannels from "./components/Users/Channels"
import Team from "./components/Team/Team"
import Header from "./components/Header"
import ProtectedRoute from "./components/ProtectedRoute"

import { AppContext } from "./contexts/Appcontext"

const Invite = () => {

    useEffect(() => {
        window.location = "https://discord.com/api/oauth2/authorize?client_id=702929032601403482&permissions=0&scope=bot"
    }, [])
    return (
        <></>
    )
} 

function App() {

    const [userId, setUserId] = useState("")
    const [dropDownOpen, setDropDownOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState()
    const [loaded, setLoaded] = useState(true)

  return (
    <AppContext.Provider
        value={{
            userId,
            setUserId,
            dropDownOpen,
            setDropDownOpen,
            currentUser,
            setCurrentUser
        }}
    >
        {loaded ? <div className="App">
            <Router>
                <Header/>
                <main className={`main ${dropDownOpen && "open"}`}>
                    <Switch>
                        <Route exact path="/" component={Home}/>
                        <Route path="/bot" component={Bot}/>
                        <Route exact path="/apps" component={Apps}/>
                        <Route path="/community" component={Community}/>
                        <Route path="/about" component={About}/>
                        <Route path="/invite" component={Invite}/>
                        <Route path="/members" component={Team}/>
                        <ProtectedRoute path="/dashboard" component={Dashboard}/>
                        <ProtectedRoute path="/my-channels" component={MyChannels}/>
                        <Redirect to="/"/>
                    </Switch>
                </main>
                <Footer/>
            </Router>
        </div> : <></>}
    </AppContext.Provider>
  );
}

export default App;
