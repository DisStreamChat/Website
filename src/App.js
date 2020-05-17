import React, {useEffect, useState} from 'react';
import firebase from "./firebase"
import './App.css';
import Header from './components/Header';
import {HashRouter as Router, Route} from "react-router-dom"
import Home from "./components/Home/Home"
import About from "./components/About/About"
import Community from "./components/Community/Community"
import Bot from './components/Bot/Bot';
import Apps from "./components/Apps/Main"
import Footer from './components/Footer';

import { AppContext } from "./contexts/Appcontext"

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
                <Route exact path="/" component={Home}/>
                <Route path="/bot" component={Bot}/>
                <Route path="/apps" component={Apps}/>
                <Route path="/community" component={Community}/>
                <Route path="/about" component={About}/>
                <Footer/>
            </Router>
        </div>
    </AppContext.Provider>
  );
}

export default App;
