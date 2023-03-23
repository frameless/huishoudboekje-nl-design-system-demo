import {Box, Divider, Heading, Stack, StackProps, Text, useBreakpointValue} from "@chakra-ui/react";
import React from "react";
import SectionTopBar from "./SectionTopBar";

type SectionProps = Omit<StackProps, "title" | "left" | "right"> & {
	title?: JSX.Element | null | string,
	helperText?: string,
	left?: JSX.Element | null | string | boolean,
	right?: JSX.Element | null | string,
	menu?: JSX.Element | null | string,
}

export const Section: React.FC<SectionProps> = ({
	title,
	helperText,
	left,
	right,
	menu,
	children,
	...props
}) => {
	const hasLeft = title || helperText || left;
	const hasTopbar = right || menu;
	const isMobile = useBreakpointValue([true, true, false]);

	return (
		<Stack direction={["column", "column", "row"]} spacing={[2, 2, 4]} {...props}>
			{isMobile && hasTopbar && (
				<Box mb={2}>
					<SectionTopBar menu={menu} right={right} />
				</Box>
			)}
			{hasLeft && (
				<Stack flex={1}>
					<Stack className="do-not-print" align={"flex-start"}>
						{title && <Heading size={"md"}>{title}</Heading>}
						{helperText && <Text fontSize={"md"} color={"gray.500"}>{helperText}</Text>}
					</Stack>
					<Stack align={"flex-start"}>
						{left}
					</Stack>
				</Stack>
			)}
			<Stack flex={[1, 3, 3]} spacing={[2, 2, 4]} divider={<Divider />}>
				{!isMobile && hasTopbar && (
					<SectionTopBar menu={menu} right={right} />
				)}
				<Box>
					{children}
				</Box>
			</Stack>
		</Stack>
	);
};

export default Section;
