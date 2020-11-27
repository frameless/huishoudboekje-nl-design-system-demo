import React from "react";
import {useIsMobile} from "react-grapple";
import {TABLET_BREAKPOINT} from "../../utils/things";
import {Flex, Stack} from "@chakra-ui/react";
import Logo from "../Logo";

const TwoColumns = ({children}) => {
	const isMobile = useIsMobile(TABLET_BREAKPOINT);

	return (
		<Flex h={"auto"} minHeight={"100vh"} minWidth={"100%"} w={"auto"} bg={isMobile ? "white" : "gray.100"}>
			<Stack width={"100%"} direction={isMobile ? "column" : "row"} justifyContent={"center"} alignItems={"center"} spacing={30}>
				<Stack bg={"grey.800"} height={isMobile ? "auto" : "100%"} alignItems={isMobile ? "center" : "flex-end"} justifyContent={"center"}
				       width={isMobile ? "100%" : "50%"}
				       p={5}>
					<Logo as={Flex} maxWidth={400} width={"100%"} />
				</Stack>
				<Stack bg={"white"} height={isMobile ? "auto" : "100%"} justifyContent={"center"} width={isMobile ? "100%" : "50%"} p={5}>
					{children}
				</Stack>
			</Stack>
		</Flex>
	);
};

export default TwoColumns;