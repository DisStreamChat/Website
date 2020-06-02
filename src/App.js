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
import Team from "./components/Team/Team"
import Header from "./components/Header"
import ProtectedRoute from "./components/ProtectedRoute"
import Loader from "react-loader"

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
    const [firebaseInit, setFirebaseInit] = useState(false)

    useEffect(() => {
        (async () => {
            const result = await firebase.isInitialized();
            setFirebaseInit(result)
        })()
    }, [])

    return firebaseInit !== false ? (
    <Router>
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
            <Switch>
                <Route path="/overlay" component={Team}></Route>
                <div className="App">
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
                            <ProtectedRoute path="/dashboard/:id" component={Dashboard}/>
                            <Redirect to="/"/>
                        </Switch>
                    </main>
                    <Footer/>
                </div> : <></>
            </Switch>
        </AppContext.Provider>
    </Router>
  ) : <main className="App">
      <Loader
      loaded={false}
      lines={15}
      length={0}
      width={15}
      radius={35}
      corners={1}
      rotate={0}
      direction={1}
      color={"#fff"}
      speed={1}
      trail={60}
      shadow={true}
      hwaccel={true}
      className="spinner"
      zIndex={2e9}
      top="50%"
      left="50%"
      scale={3.0}
      loadedClassName="loadedContent"
  /></main>
}

export default App;
