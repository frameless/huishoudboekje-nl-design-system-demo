import React from "react";
import {Box, BoxProps, Button, Grid, Stack, Text} from "@chakra-ui/core";
import {IOrganisatie} from "../../models";
import Routes from "../../config/routes";
import {useHistory} from "react-router-dom";
import {useTranslation} from "react-i18next";
import GridCard from "../GridCard";

const OrganizationListView: React.FC<BoxProps & { organizations: IOrganisatie[], showAddButton?: boolean }> = ({organizations, showAddButton = false, ...props}) => {
	const {t} = useTranslation();
	const {push} = useHistory();

	return (
		<Grid maxWidth={"100%"} gridTemplateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)", "repeat(4, 1fr)", "repeat(6, 1fr)"]} gap={5}>
			{showAddButton && (
				<Box>
					<Button variantColor={"blue"} borderStyle={"dashed"} variant={"outline"} leftIcon={"add"}
					        w="100%" h="100%" onClick={() => push(Routes.CreateOrganization)} borderRadius={5}
					        p={5}>{t("buttons.organizations.createNew")}</Button>
				</Box>
			)}
			{organizations.map((o, i) => (
				<GridCard key={i} justifyContent={"flex-start"} onClick={() => {
					push(Routes.Organization(o.id))
				}}>
					<Stack spacing={1}>
						<Text fontSize={"md"}><strong>{o.weergaveNaam}</strong></Text>
						<Text fontSize={"md"} color={"gray.400"}>{o.kvkDetails.plaatsnaam}</Text>
					</Stack>
				</GridCard>
			))}
		</Grid>

	);
};

export default OrganizationListView;