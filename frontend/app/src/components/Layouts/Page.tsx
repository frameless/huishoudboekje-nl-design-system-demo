import {Box, Heading, Stack, StackProps} from "@chakra-ui/react";
import React from "react";

type PageProps = Omit<Partial<StackProps>, "right"> & {
	title: string,
	backButton?: JSX.Element,
	menu?: JSX.Element | null,
	right?: JSX.Element | null
};
const Page: React.FC<PageProps> = ({title, backButton, menu, right, children, ...props}) => {
	return (
		<Stack spacing={5} {...props}>
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