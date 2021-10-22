import React from "react";
import {Afdeling} from "../../generated/graphql";
import AfdelingListItem from "./AfdelingListItem";

const AfdelingenList: React.FC<{afdelingen: Afdeling[]}> = ({afdelingen}) => {
	if (afdelingen.length === 0) {
		return null;
	}

	return (<>
		{afdelingen.map(afdeling => (
			<AfdelingListItem afdeling={afdeling} />
		))}
	</>);
};

export default AfdelingenList;