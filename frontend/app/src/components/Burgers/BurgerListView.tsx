import {AddIcon} from "@chakra-ui/icons";
import {Avatar, Box, BoxProps, Button, Grid, Stack, Text, useBreakpointValue} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import Routes from "../../config/routes";
import {Gebruiker} from "../../generated/graphql";
import {formatBurgerName} from "../../utils/things";
import GridCard from "../GridCard";

const BurgerListView: React.FC<BoxProps & { burgers: Gebruiker[], showAddButton?: boolean }> = ({burgers, showAddButton = false, ...props}) => {
	const {t} = useTranslation();
	const {push} = useHistory();
	const isMobile = useBreakpointValue([true, null, null, false]);

	return (
		<Grid maxWidth={"100%"} gridTemplateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)", "repeat(4, 1fr)", "repeat(6, 1fr)"]} gap={5}>
			{showAddButton && (
				<Box>
					<Button colorScheme={"blue"} borderStyle={"dashed"} variant={"outline"} leftIcon={<AddIcon />} w="100%" h="100%" onClick={() => push(Routes.CreateBurger)}
					        borderRadius={5} p={5}>{t("actions.add")}</Button>
				</Box>
			)}
			{burgers.map((g, i) => (
				<GridCard key={i} justifyContent={["flex-start", "center"]} onClick={() => {
					push(Routes.Burger(g.id));
				}}>
					<Stack direction={["row", "column"]} spacing={5} alignItems={"center"}>
						<Avatar name={formatBurgerName(g, true)} />
						<Text fontSize={"md"} {...!isMobile && {textAlign: "center"}}><strong>{`${g.voornamen} ${g.achternaam}`}</strong></Text>
					</Stack>
				</GridCard>
			))}
		</Grid>
	);
};

export default BurgerListView;