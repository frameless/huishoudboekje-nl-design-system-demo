import "@gemeente-denhaag/design-tokens-components";
import React from "react";
import {API_URL} from "./config";
import Huishoudboekje from "./lib/App";
import {HuishoudboekjeUser} from "./lib/models";

const App = () => {
	const user: HuishoudboekjeUser = {
		bsn: 999999990,
	};

	return (
		<div style={{
			width: 800,
			margin: "0 auto",
		}}>
			<Huishoudboekje user={user} config={{apiUrl: API_URL}} />
		</div>
	);

};

export default App;