import React from "react";
import Huishoudboekje from "./lib/Huishoudboekje";

const App = () => {
	const user = {
		bsn: 999999990,
	};

	return (
		<div style={{
			width: "700px",
			margin: "0 auto",
		}}>

			<Huishoudboekje user={user} />

		</div>
	);
};

export default App;