import {Spinner} from "@chakra-ui/react";
import React from "react";
import TwoColumns from "./Layouts/TwoColumns";

const LoadingPage = () => {
	return (
		<TwoColumns>
			<Spinner size={"xl"} />
		</TwoColumns>
	);
};

export default LoadingPage;