import {Box, Heading, Stack} from "@chakra-ui/react";
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
				<Stack direction={"row"} justifyContent={"flex-start"} alignItems={"center"} spacing={3}>
					<Heading size={"lg"}>{title}</Heading>
					{menu}
				</Stack>
				{right && <Box>{right}</Box>}
			</Stack>

			{children}
		</Stack>
	);
};

export default Page;