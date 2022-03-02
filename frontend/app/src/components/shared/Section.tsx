import {Box, Divider, Heading, HStack, Stack, StackProps, Text, useStyleConfig} from "@chakra-ui/react";
import React from "react";
import deprecatedComponent from "../../utils/Deprecated";

const _DeprecatedSection_ = (props) => {
	const styles = useStyleConfig("Section");
	return (
		<Stack sx={styles} {...props} />
	);
};

export const DeprecatedSection = deprecatedComponent(_DeprecatedSection_, "Please refactor this component to the new Section component.");

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
	const styles = useStyleConfig("Section");

	return (
		<Stack sx={styles} {...props}>
			{(title || helperText || right || menu) && (<>
				<Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
					<Stack alignItems={"flex-start"}>
						{title && <Heading size={"md"}>{title}</Heading>}
						{helperText && <Text fontSize={"md"} color={"gray.500"}>{helperText}</Text>}
					</Stack>
					<HStack>
						{right && <Box>{right}</Box>}
						{menu}
					</HStack>
				</Stack>
				<Divider />
			</>)}

			{left ? (
				<Stack direction={["column", null, "row"]}>
					<Stack flex={1} alignItems={"flex-start"}>
						{typeof left !== "boolean" && left}
					</Stack>
					<Stack flex={[1, 2, 3]} alignItems={"flex-start"}>
						{children}
					</Stack>
				</Stack>
			) : children}
		</Stack>
	);
};

export default Section;