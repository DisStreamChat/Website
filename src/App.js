import React, {useEffect, useState} from "react"
import firebase from "./firebase"
import "./App.css"
import Header from "./components/Header"
import {HashRouter as Router, Route, Redirect, Switch} from "react-router-dom"
import Home from "./components/Home/Home"
import About from "./components/About/About"
import Community from "./components/Community/Community"
import Bot from "./components/Bot/Bot"
import Apps from "./components/Apps/Main"
import Footer from "./components/Footer"
import Main from "./components/Users/Main"
import Team from "./components/Team/Team"

import { AppContext } from "./contexts/Appcontext"

const Invite = () => {

    useEffect(() => {
        window.location = "https://discord.com/api/oauth2/authorize?client_id=702929032601403482&permissions=0&scope=bot"
    }, [])
    return (
        <>
        
        </>
    )
} 

function App() {

    const [userId, setUserId] = useState("")

  return (
    <AppContext.Provider
        value={{
            userId,
            setUserId
        }}
    >
        <div className="App">
            <Router>
                <Header/>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route path="/bot" component={Bot}/>
                    <Route path="/apps" component={Apps}/>
                    <Route path="/community" component={Community}/>
                    <Route path="/about" component={About}/>
                    <Route path="/account/:id" component={Main}/>
                    <Route path="/invite" component={Invite}/>
                    <Route path="/members" component={Team}/>
                    <Redirect to="/"/>
                </Switch>
                <Footer/>
            </Router>
        </div>
    </AppContext.Provider>
  );
}

export default App;
