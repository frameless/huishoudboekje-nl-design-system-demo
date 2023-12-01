import {useLocation} from "react-router-dom";
import _ from "lodash";
import {Burger, Huishouden, useGetHuishoudensQuery} from "../../../generated/graphql";
import Queryable from "../../../utils/Queryable";
import Page from "../../shared/Page";

import HuishoudenOverzicht from "./HuishoudenOverzicht";
import {useState} from "react";
import {Box, Card, FormControl} from "@chakra-ui/react";
import Select from "react-select";
import {formatBurgerName, formatHuishoudenName, useReactSelectStyles} from "../../../utils/things";
import {useTranslation} from "react-i18next";


const HuishoudenOverzichtIndex = () => {
    const {search: queryParams} = useLocation();
    const {t} = useTranslation()
    const [huishoudenId, setHuishoudenId] = useState<number | null>(new URLSearchParams(queryParams).get("huishoudenId")?.split(",").map(p => parseInt(p))[0] || null);

    const reactSelectStyles = useReactSelectStyles();
    const $huishoudens = useGetHuishoudensQuery({fetchPolicy: 'cache-and-network'});

    function onSelectHuishouden(value) {
        if (value) {
            setHuishoudenId(value.value)
        }
        else {
            setHuishoudenId(null)
        }

    }

    function getSelectedBurgersFromHuishouden(burgers: Burger[], huishoudenId) {
        const burger_ids = burgers.filter(burger => burger.huishoudenId == huishoudenId).map(burger => (burger.id ?? -1))

        return burger_ids
    }

    function getBurgersString(burgers) {
        let resultstring = ""
        for (const burger of burgers) {
            resultstring += ` ${formatBurgerName(burger)}`
            if (burgers.indexOf(burger) != burgers.length - 1) {
                resultstring += ','
            }

        }
        return resultstring
    }


    return (
        <Queryable query={$huishoudens} children={data => {
            const burgers = data.burgers
            const huishoudens: Huishouden[] = []
            const grouped = _.groupBy(burgers, burger => burger.huishoudenId)
            Object.keys(grouped).forEach(element =>
                huishoudens.push({id: Number(element), burgers: grouped[element]})
            )
            const burger_ids = getSelectedBurgersFromHuishouden(burgers, huishoudenId) ?? []
            return (
                <Page title="Huishouden Overzicht">
                    <FormControl>
                        <Select onChange={onSelectHuishouden} options={huishoudens.map(huishouden => ({
                            key: huishouden.id,
                            value: huishouden.id,
                            label: `Huishouden: ${formatHuishoudenName(huishouden)}, Burgers:${getBurgersString(huishouden.burgers)}`,
                        }))} styles={reactSelectStyles.default} isClearable={true} noOptionsMessage={() => t("select.noOptions")} maxMenuHeight={200} placeholder={t("select.placeholder")} />
                    </FormControl>
                    {}
                    {(burger_ids.length > 0) &&
                        <HuishoudenOverzicht burgerIds={burger_ids}></HuishoudenOverzicht>
                    }
                    {(huishoudenId == null || huishoudenId == 0) &&
                        <Box textColor={"red.500"}>
                            Selecteer een huishouden om een overzicht te genereren
                        </Box>
                    }
                </Page>
            )

        }} />
    )

}

export default HuishoudenOverzichtIndex;