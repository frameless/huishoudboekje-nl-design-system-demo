import React from "react";
import Huishoudboekje, {HuishoudboekjeUser} from "./lib/Huishoudboekje";
import {useTranslation} from "react-i18next";
import {Text} from "@chakra-ui/react";
import "@gemeente-denhaag/design-tokens-components";

const App = () => {
	const {t} = useTranslation();
	const user: HuishoudboekjeUser = {
		bsn: 999999990,
		// bsn: 123,
	};

	return (
		<div style={{
			width: 800,
			margin: "0 auto",
		}}>

			<Text>{t("message.welcome")} </Text>
			<Huishoudboekje user={user} config={{
				apiUrl: "https://test.huishoudboekje.demoground.nl/api/burgers",
			}} />

		</div>
	);
};

export default App;