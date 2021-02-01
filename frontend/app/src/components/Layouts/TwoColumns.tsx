import {Flex, Stack} from "@chakra-ui/react";
import React from "react";
import Logo from "../Logo";

const TwoColumns = ({children}) => {
	return (
		<Flex h={"auto"} minHeight={"100vh"} minWidth={"100%"} w={"auto"} bg={["white", null, null, "gray.100"]}>
			<Stack width={"100%"} direction={["column", null, null, "row"]} justifyContent={"center"} alignItems={"center"} spacing={30}>
				<Stack bg={"grey.800"} height={["auto", null, null, "100%"]} alignItems={["center", null, null, "flex-end"]} justifyContent={"center"}
				       width={["100%", null, null, "50%"]}
				       p={5}>
					<Logo as={Flex} maxWidth={400} width={"100%"} height={"100%"} maxHeight={500} />
				</Stack>
				<Stack bg={"white"} height={["auto", null, null, "100%"]} justifyContent={"center"} width={["100%", null, null, "50%"]} p={5}>
					{children}
				</Stack>
			</Stack>
		</Flex>
	);
};

export default TwoColumns;