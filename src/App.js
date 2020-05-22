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
import Main from "./components/Users/Main"
import Team from "./components/Team/Team"
import Header from "./components/Header"

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
    const [dropDownOpen, setDropDownOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState()

    useEffect(() => {
        setCurrentUser({
            profilePicture: "https://static-cdn.jtvnw.net/jtv_user_pictures/9e40522b-dca4-4e2e-9aa0-ccfa6550e208-profile_image-300x300.png",
            name: "dav1dsnyder404"
        })
    }, [])

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
        <div className="App">
            <Router>
                <Header/>
                <Switch>
                    <main className={`main ${dropDownOpen && "open"}`}>
                        <Route exact path="/" component={Home}/>
                        <Route path="/bot" component={Bot}/>
                        <Route exact path="/apps" component={Apps}/>
                        <Route path="/community" component={Community}/>
                        <Route path="/about" component={About}/>
                        <Route path="/account/:id" component={Main}/>
                        <Route path="/invite" component={Invite}/>
                        <Route path="/members" component={Team}/>
                    </main>
                    {/* <Route path="/apps/chat_app" component={Team}></Route> */}
                    <Redirect to="/"/>
                </Switch>
                <Footer/>
            </Router>
        </div>
    </AppContext.Provider>
  );
}

export default App;
