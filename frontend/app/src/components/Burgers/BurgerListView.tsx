import {AddIcon} from "@chakra-ui/icons";
import {Avatar, Badge, Box, Button, Grid, Stack, Text, useBreakpointValue} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../../config/routes";
import {Burger, Signaal} from "../../generated/graphql";
import {formatBurgerName} from "../../utils/things";
import GridCard from "../shared/GridCard";

type BurgerListViewProps = {
    burgers: Burger[],
    showAddButton?: boolean
};

const BurgerListView: React.FC<BurgerListViewProps> = ({burgers, showAddButton = false}) => {
	const {t} = useTranslation();
	const navigate = useNavigate();
	const isMobile = useBreakpointValue([true, null, null, false]);

	const signalen = burgers.reduce((list, burger: Burger) => {
		const signalen = (burger.afspraken || [])
			.map(a => a.alarm)
			.map(a => a?.signaal)
			.filter(s => s?.isActive)
			.filter(s => s !== undefined);

		list.push(...signalen as Signaal[]);
		return list;
	}, [] as Signaal[]);

	return (
		<Grid maxWidth={"100%"} gridTemplateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)", "repeat(4, 1fr)", "repeat(6, 1fr)"]} gap={5}>
			{showAddButton && (
				<Box>
					<Button colorScheme={"primary"} borderStyle={"dashed"} variant={"outline"} leftIcon={<AddIcon />}
						w={"100%"} h={"100%"} onClick={() => navigate(AppRoutes.CreateBurger())} borderRadius={5} p={5}>{t("global.actions.add")}</Button>
				</Box>

			)}
			{burgers.map((g, i) => (
				<GridCard key={i} justifyContent={["flex-start", "center"]} position={"relative"} onClick={() => {
					navigate(AppRoutes.Burger(g.id));
				}}>
					{signalen.length > 0 && (
						<Box position={"absolute"} top={1} right={1}>
							<Badge fontSize={"0.8rem"} p={1} colorScheme={"secondary"}>
								{signalen.length}
							</Badge>
						</Box>
					)}
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