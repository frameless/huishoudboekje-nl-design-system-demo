import React from "react";
import logo from "./logo.svg";
import "./App.scss";
import ApiStatus from "./components/ApiStatus";
import { useTranslate } from "./config/i18n";
import { Trans } from "react-i18next";

const App = () => {
	const { t } = useTranslate();

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					{t("home.running-in-mode", {
						mode: process.env.NODE_ENV,
					})}
				</p>

				<p>
					<Trans
						i18nKey={"home.hello-intro"}
						components={{
							link: <a href={"/"}>Blaat</a>,
						}}>
						Test
					</Trans>
				</p>

				<ApiStatus />
			</header>
		</div>
	);
};

export default App;
