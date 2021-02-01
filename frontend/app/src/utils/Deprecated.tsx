import React from "react";
import {isDev} from "./things";

const deprecatedComponent = (InnerComponent, message: string = "This component is deprecated.") => (props) => {
	if (isDev) {
		const deprecationMessage = `You are using ${InnerComponent.name} which is deprecated.`;
		console.error(deprecationMessage, message);
	}

	return <InnerComponent {...props} />;
};

export default deprecatedComponent;