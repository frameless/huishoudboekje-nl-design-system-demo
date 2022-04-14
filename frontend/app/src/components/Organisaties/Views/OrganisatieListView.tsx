import {Box, BoxProps, Grid, Stack, Text} from "@chakra-ui/react";
import React from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {AppRoutes} from "../../../config/routes";
import {Organisatie} from "../../../generated/graphql";
import GridCard from "../../shared/GridCard";
import DashedAddButton from "../../shared/DashedAddButton";

const OrganisatieListView: React.FC<BoxProps & { organisaties: Organisatie[], showAddButton?: boolean }> = ({organisaties, showAddButton = false, ...props}) => {
    const {t} = useTranslation();
    const navigate = useNavigate();

    return (
        <Grid maxWidth={"100%"} gridTemplateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)", "repeat(3, 1fr)"]} gap={5}>
            {showAddButton && (
                <Box>
                    <DashedAddButton onClick={() => navigate(AppRoutes.CreateOrganisatie)} />
                </Box>
            )}
            {organisaties.map(o => (
                <GridCard key={o.id} justifyContent={"center"} onClick={() => {
                    navigate(AppRoutes.Organisatie(String(o.id)));
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