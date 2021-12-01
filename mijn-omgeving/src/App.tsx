import React from "react";
import Huishoudboekje, {HuishoudboekjeUser} from "./lib/Huishoudboekje";

const App = () => {
	const user: HuishoudboekjeUser = {
		bsn: 999999990,
		// bsn: 123,
	};

	return (
		<div style={{
			width: "600px",
			margin: "0 auto",
		}}>

			<Huishoudboekje user={user} config={{
				apiUrl: "https://test.huishoudboekje.demoground.nl/api/burgers",
			}} />

		</div>
	);
};

export default App;