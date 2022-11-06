import {Box, BoxProps} from "@chakra-ui/react";
import React from "react";
import {IconContext} from "react-icons";

type LinkIconProps = BoxProps & {
	color: IconContext["color"];
};

const LinkIcon: React.FC<LinkIconProps> = ({color, children, ...props}) => (
	<IconContext.Provider value={{style: {color}}}>
		<Box {...props}>
			{children}
		</Box>
	</IconContext.Provider>
);

export default LinkIcon;
