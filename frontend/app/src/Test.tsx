import {Skeleton} from "@chakra-ui/react";
import React from "react";
import Page from "./components/Layouts/Page";
import Section from "./components/Layouts/Section";

const Test = () => {
	return (
		<Page title={"Testpagina"}>
			<Section>

				<Skeleton h={50} w={"100%"} />
				<Skeleton h={50} w={"100%"} />

			</Section>
		</Page>
	);
};

export default Test;