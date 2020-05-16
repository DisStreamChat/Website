import React, {useEffect, useState} from 'react';
import firebase from "./firebase"
import './App.css';
import Header from './components/Header';
import {HashRouter as Router} from "react-router-dom"

function App() {
  return (
    <main className="App">
        <Router>
            <Header/>

        </Router>
    </main>
  );
}

export default App;
