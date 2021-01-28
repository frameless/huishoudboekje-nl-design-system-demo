import {Box, Button, Heading, Stack, Text, useBreakpointValue} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {MdArrowBack} from "react-icons/all";
import {useHistory} from "react-router-dom";
import Routes from "../config/routes";
import NotFoundIllustration from "./Illustrations/NotFoundIllustration";

const PageNotFound = () => {
	const isMobile = useBreakpointValue([true, null, null, false]);
	const {push} = useHistory();
	const {t} = useTranslation();

	return (
		<Stack direction={["column", "row"]} justifyContent={"center"} alignItems={"center"} bg={"white"} borderRadius={5} p={20} spacing={20}>
			<Stack spacing={5}>
				<Stack spacing={0}>
					<Heading size={"2xl"} fontSize={"5em"} color={"primary.300"} maxWidth={450}>{t("pages.notFound.title")}</Heading>
					<Heading size={"xl"} maxWidth={450}>{t("pages.notFound.subTitle")}</Heading>
				</Stack>
				<Stack spacing={10}>
					<Text fontSize={"sm"} color={"gray.500"}>{t("pages.notFound.description")}</Text>
					<Button variant={"unstyled"} onClick={() => push(Routes.Home)}>
						<Stack direction={"row"} alignItems={"center"}>
							<Box as={MdArrowBack} w={"16px"} h={"16px"} mr={2} color={"gray.400"} />
							<Text fontSize={"sm"} color={"gray.400"}>{t("actions.backToHome")}</Text>
						</Stack>
					</Button>
				</Stack>
			</Stack>
			{!isMobile && <Box as={NotFoundIllustration} width={"100%"} maxWidth={[200, 300, 300]} height={[200, 300, 300]} justifyContent={"center"} alignItems={"center"} />}
		</Stack>
	);
};

export default PageNotFound;