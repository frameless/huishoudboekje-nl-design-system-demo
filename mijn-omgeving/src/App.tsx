import React from "react";
import Huishoudboekje, {HuishoudboekjeUser} from "./lib/Huishoudboekje";
import "@gemeente-denhaag/design-tokens-components";
import Navigation from "./lib/Navigation";
import Toekomst from "./lib/Toekomst/Toekomst";
import {Route, Routes} from "react-router-dom";

const App = () => {
	const user: HuishoudboekjeUser = {
		bsn: 999999990,
		// bsn: 123,
	};

	return (
		<div style={{
			width: 800,
			margin: "0 auto",
		}}>
			<div className={"container"}>
				<Navigation />
			</div>

			<Routes>
				<Route path={"/"} element={<Huishoudboekje user={user} config={{apiUrl: "https://test.huishoudboekje.demoground.nl/api/burgers"}} />} />
				<Route path={"/toekomst"} element={<Toekomst />} />
			</Routes>
		</div>
	);

};

export default App;