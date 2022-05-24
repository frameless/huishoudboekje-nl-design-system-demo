import {Grid, GridItem} from "@chakra-ui/react";
import {Card} from "@gemeente-denhaag/card";
import {Heading2} from "@gemeente-denhaag/typography";
import React from "react";
import {useNavigate} from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <>
            <Heading2>Huishoudboekje</Heading2>
            <Grid templateColumns={["repeat(1, 1fr)", "repeat(2, 1fr)"]} gap={10} mt={3}>
                <GridItem>
                    <Card
                        title={"Toekomst"}
                        subTitle={"Verwachte transacties"}
                        onClick={() => navigate("/toekomst")}
                    />
                </GridItem>
                <GridItem>
                    <Card
                        title={"Banktransacties"}
                        subTitle={"Overzicht van alle bij- en afschrijvingen."}
                        onClick={() => navigate("/banktransacties")}
                    />
                </GridItem>
                <GridItem>
                    <Card
                        title={"Mijn gegevens"}
                        onClick={() => navigate("/gegevens")}
                    />
                </GridItem>
                <GridItem>
                    <Card
                        title={"Afspraken"}
                        subTitle={"Overzicht van alle afspraken."}
                        onClick={() => navigate("/afspraken")}
                    />
                </GridItem>
            </Grid>
        </>
    );

};

export default Dashboard;