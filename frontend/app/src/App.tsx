import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import ApiStatus from "./ApiStatus";

const App = () => {
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>Running in {process.env.NODE_ENV} mode.</p>

				<ApiStatus />
			</header>
		</div>
	);
};

export default App;