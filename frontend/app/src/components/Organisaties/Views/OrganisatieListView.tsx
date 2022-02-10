import {AddIcon} from "@chakra-ui/icons";
import {Box, BoxProps, Button, Grid, Stack, Text} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../../../config/routes";
import {Organisatie} from "../../../generated/graphql";
import GridCard from "../../shared/GridCard";

const OrganisatieListView: React.FC<BoxProps & {organisaties: Organisatie[], showAddButton?: boolean}> = ({organisaties, showAddButton = false, ...props}) => {
	const {t} = useTranslation();
	const navigate = useNavigate();

	return (
		<Grid maxWidth={"100%"} gridTemplateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]} gap={5}>
			{showAddButton && (
				<Box>
					<Button colorScheme={"primary"} borderStyle={"dashed"} variant={"outline"} leftIcon={<AddIcon />}
						w="100%" h="100%" onClick={() => navigate(AppRoutes.CreateOrganisatie)} borderRadius={5}
						p={5}>{t("global.actions.add")}</Button>
				</Box>
			)}
			{organisaties.map(o => (
				<GridCard key={o.id} justifyContent={"center"} onClick={() => {
					navigate(AppRoutes.Organisatie(o.id));
				}}>
					<Stack spacing={1}>
						<Text fontSize={"md"} overflowX={"hidden"} textOverflow={"ellipsis"} width={"100%"} maxW={["300px", "250px"]} title={o.naam}>
							<strong>{o.naam}</strong>
						</Text>
					</Stack>
				</GridCard>
			))}
		</Grid>
	);
};

export default OrganisatieListView;