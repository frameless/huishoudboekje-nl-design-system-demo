import {useLocation} from "react-router-dom";
import _ from "lodash";
import {Burger, Huishouden, useGetHuishoudensQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import Page from "../../shared/Page";

import HuishoudenOverzicht from "./HuishoudenOverzicht";
import {useState} from "react";
import {Box, Card, FormControl} from "@chakra-ui/react";
import Select from "react-select";
import {formatBurgerName, formatHuishoudenName, getBurgerHhbId, useReactSelectStyles} from "../../../utils/things";
import {useTranslation} from "react-i18next";


const HuishoudenOverzichtIndex = () => {
    const {search: queryParams} = useLocation();
    const {t} = useTranslation()
    const [filterBurgerIds, setFilterBurgerIds] = useState<number[]>(new URLSearchParams(queryParams).get("burgerId")?.split(",").map(p => parseInt(p)) || []);

    const reactSelectStyles = useReactSelectStyles();
    const $huishoudens = useGetHuishoudensQuery({fetchPolicy: 'cache-and-network'});

    return (

        <Queryable query={$huishoudens} children={data => {
            const burgers: Burger[] = data.burgers || [];
            const selectedBurgers = burgers.filter(b => filterBurgerIds.includes(b.id!));
            const burgers_filter = burgers.filter(b => filterBurgerIds.includes(b.id!)).map(b => ({
                key: b.id,
                value: b.id,
                label: formatBurgerName(b) + " " + getBurgerHhbId(b),
            }));
            const onSelectBurger = (value) => {
                setFilterBurgerIds(value ? value.map(v => v.value) : [])
            };
            return (
                <Page title="Huishouden Overzicht">
                    <FormControl>
                        <Select onChange={onSelectBurger} options={burgers.map(b => ({
                            key: b.id,
                            value: b.id,
                            label: formatBurgerName(b) + " " + getBurgerHhbId(b),
                        }))} styles={reactSelectStyles.default} isMulti isClearable={true} noOptionsMessage={() => t("select.noOptions")} maxMenuHeight={200} placeholder={t("charts.optionAllBurgers")} value={burgers_filter} />
                    </FormControl>
                    {}
                    {(selectedBurgers.length > 0) &&
                        <HuishoudenOverzicht burgerIds={filterBurgerIds} burgers={selectedBurgers}></HuishoudenOverzicht>
                    }
                    {(selectedBurgers.length == 0) &&
                        <Box textColor={"red.500"}>
                            Selecteer burger(s) om een overzicht te genereren
                        </Box>
                    }
                </Page>
            )

        }} />
    )

}

export default HuishoudenOverzichtIndex;