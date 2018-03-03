import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './components/Messages'
import Messages from "./components/Messages";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
            <Messages/>
        </p>
      </div>
    );
  }
}

export default App;
