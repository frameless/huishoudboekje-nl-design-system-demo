import React from "react";
import {Signal} from "../../generated/graphql";
import {Box} from "@chakra-ui/react";

const SignalenList: React.FC<{ signalen: Signal[] }> = ({signalen}) => {
	return (
		<Box>
			<pre>{JSON.stringify(signalen, null, 2)}</pre>
		</Box>
	);
};

export default SignalenList;