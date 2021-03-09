import {AddIcon} from "@chakra-ui/icons";
import {Box, BoxProps, Button, Grid, Stack, Text} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import Routes from "../../../config/routes";
import {Organisatie} from "../../../generated/graphql";
import GridCard from "../../GridCard";

const OrganisatieListView: React.FC<BoxProps & {organisaties: Organisatie[], showAddButton?: boolean}> = ({organisaties, showAddButton = false, ...props}) => {
	const {t} = useTranslation();
	const {push} = useHistory();

	return (
		<Grid maxWidth={"100%"} gridTemplateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]} overflowX={"scroll"} gap={5}>
			{showAddButton && (
				<Box>
					<Button colorScheme={"primary"} borderStyle={"dashed"} variant={"outline"} leftIcon={<AddIcon />}
						w="100%" h="100%" onClick={() => push(Routes.CreateOrganisatie)} borderRadius={5}
						p={5}>{t("actions.add")}</Button>
				</Box>
			)}
			{organisaties.map((o, i) => (
				<GridCard key={i} justifyContent={"center"} onClick={() => {
					push(Routes.Organisatie(o.id));
				}}>
					<Stack spacing={1}>
						<Text fontSize={"md"} overflowX={"hidden"} textOverflow={"ellipsis"} width={"100%"} maxW={["300px", "250px"]} title={o.weergaveNaam}><strong>{o.weergaveNaam}</strong></Text>
						<Text fontSize={"md"} color={"gray.400"}>{o.kvkDetails?.plaatsnaam}</Text>
					</Stack>
				</GridCard>
			))}
		</Grid>
	);
};

export default OrganisatieListView;