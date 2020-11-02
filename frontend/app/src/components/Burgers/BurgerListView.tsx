import React from "react";
import {Avatar, Box, BoxProps, Button, Grid, Stack, Text} from "@chakra-ui/core";
import {IGebruiker} from "../../models";
import Routes from "../../config/routes";
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useIsMobile} from "react-grapple";
import GridCard from "../GridCard";

const BurgerListView: React.FC<BoxProps & { burgers: IGebruiker[], showAddButton?: boolean }> = ({burgers, showAddButton = false, ...props}) => {
	const {t} = useTranslation();
	const {push} = useHistory();
	const isMobile = useIsMobile(450);

	return (
		<Grid maxWidth={"100%"} gridTemplateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)", "repeat(4, 1fr)", "repeat(6, 1fr)"]} gap={5}>
			{showAddButton && (
				<Box>
					<Button variantColor={"blue"} borderStyle={"dashed"} variant={"outline"} leftIcon={"add"}
					        w="100%" h="100%" onClick={() => push(Routes.CreateBurger)} borderRadius={5}
					        p={5}>{t("buttons.burgers.createNew")}</Button>
				</Box>
			)}
			{burgers.map((g, i) => (
				<GridCard key={i} justifyContent={isMobile ? "flex-start" : "center"} onClick={() => {
					push(Routes.Burger(g.id))
				}}>
					<Stack direction={isMobile ? "row" : "column"} spacing={5} alignItems={"center"}>
						<Avatar name={`${g.voornamen} ${g.achternaam}`} />
						<Text fontSize={"md"} {...!isMobile && {textAlign: "center"}}><strong>{`${g.voornamen} ${g.achternaam}`}</strong></Text>
					</Stack>
				</GridCard>
			))}
		</Grid>

	);
};

export default BurgerListView;