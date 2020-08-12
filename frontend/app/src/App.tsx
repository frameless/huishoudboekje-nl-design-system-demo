import React from 'react';
import logo from './logo.svg';
import {BrowserRouter as Router, Link, Route, Switch} from "react-router-dom";
import './App.scss';

function App() {
    return (
        <Router>
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <p>
                        Edit <code>src/App.tsx</code> and save to reload.
                    </p>
                    <p>Running in {process.env.NODE_ENV} mode.</p>

                    <Switch>
                        <Route path={"/about"}>
                            <p> Backend can be found on {process.env.REACT_APP_API_BASE_URL}</p>
                            <Link
                                to={"/"}
                                className="App-link"
                            >
                                Home
                            </Link>
                        </Route>
                        <Route>
                            <Link
                                to={"/about"}
                                className="App-link"
                            >
                                About
                            </Link>
                        </Route>
                    </Switch>
                </header>
            </div>
        </Router>
    );
}

export default App;
