import {Box, Heading, HStack, Stack} from "@chakra-ui/react";
import React from "react";

type PageProps = {
	title: string,
	backButton?: JSX.Element,
	menu?: JSX.Element | null | false,
	right?: JSX.Element | null | false
};

const Page: React.FC<PageProps> = ({title, backButton, menu, right, children}) => {
	return (
		<Stack spacing={5}>
			{backButton && <Box>{backButton}</Box>}

			<Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
				<Heading size={"lg"}>{title}</Heading>
				<HStack>
					{right && <Box>{right}</Box>}
					{menu}
				</HStack>
			</Stack>

			{children}
		</Stack>
	);
};

export default Page;