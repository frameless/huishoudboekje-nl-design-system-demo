import { useTranslation } from "react-i18next";
import { Burger, useGetCitizensSignalsFilterQuery } from "../../generated/graphql";
import { formatBurgerName, getBurgerHhbId, useReactSelectStyles } from "../../utils/things";
import Queryable from "../../utils/Queryable";
import { Checkbox, CheckboxGroup, FormControl, FormLabel, Stack } from "@chakra-ui/react";
import Select from "react-select";

type AfspraakFormProps = {
    goFirst: () => void,
    filterByCitizens,
	setFilterByCitizens: (value) => void,
	setFilterByActive: (value) => void
};

const SignalsFilters: React.FC<AfspraakFormProps>  = ({goFirst, filterByCitizens, setFilterByCitizens, setFilterByActive}) => {
	const {t} = useTranslation();
	const $citizens = useGetCitizensSignalsFilterQuery();
	const reactSelectStyles = useReactSelectStyles();

    const onSelectBurger = (value) => {
		const newValue = value ? value.map(v => v.value) : []
		setFilterByCitizens(newValue)
        goFirst()
	};

    const onSetActive = (value) => {           
        setFilterByActive(() => ({
            active: value.includes("active"),
            inactive: value.includes("inactive"),
        }));
        goFirst()
	};

	return (
		<Queryable query={$citizens} children={(data) => {
			const citizens: Burger[] = data.burgers ?? [];

			const citizensSelection = citizens.filter(b => filterByCitizens.includes(b.uuid!)).map(b => ({
                key: b.uuid,
                value: b.uuid,
                label: formatBurgerName(b) + " " + getBurgerHhbId(b),
            }));
        return (
            <Stack>
                <FormControl>
                    <FormLabel>{t("signals.filterByStatus")}</FormLabel>
                    <CheckboxGroup defaultValue={["active"]} onChange={onSetActive}>
                        <Stack>
                            <Checkbox value={"active"}>{t("signals.showActive")}</Checkbox>
                            <Checkbox value={"inactive"}>{t("signals.showInActive")}</Checkbox>
                        </Stack>
                    </CheckboxGroup>
                </FormControl>

                <FormControl>
                    <FormLabel>{t("signals.filterByBurger")}</FormLabel>
                    <Select 
                        id={"citizenFilter"}
                        onChange={onSelectBurger} 
                        options={citizens.map(b => ({
                            key: b.uuid,
                            value: b.uuid,
                            label: formatBurgerName(b) + " " + getBurgerHhbId(b),
                        }))}
                        styles={reactSelectStyles.default} 
                        isMulti={true}
                        isClearable={true} 
                        noOptionsMessage={() => t("select.noOptions")} 
                        maxMenuHeight={350}
                        placeholder={t("select.placeholder")}
                        value={citizensSelection} 
                    />
                </FormControl>
            </Stack>
			);
		}} />
	);
};

export default SignalsFilters;