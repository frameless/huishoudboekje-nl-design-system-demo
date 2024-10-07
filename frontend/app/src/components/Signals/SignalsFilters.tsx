import { useTranslation } from "react-i18next";
import { Burger, useGetCitizensSignalsFilterQuery } from "../../generated/graphql";
import { formatBurgerName, getBurgerHhbId, useReactSelectStyles } from "../../utils/things";
import Queryable from "../../utils/Queryable";
import { Checkbox, CheckboxGroup, FormControl, FormLabel, Stack } from "@chakra-ui/react";
import Select from "react-select";

type SignalFormProps = {
    goFirst: () => void,
    filterByCitizens,
	setFilterByCitizens: (value) => void,
    filterByTypes,
    setFilterByTypes: (value) => void ,
	setFilterByActive: (value) => void
};


const SignalsFilters: React.FC<SignalFormProps>  = ({goFirst, filterByCitizens, setFilterByCitizens, filterByTypes, setFilterByTypes, setFilterByActive}) => {
	const {t} = useTranslation();
	const $citizens = useGetCitizensSignalsFilterQuery();
	const types = [{
        id: 1,
        name: t("signals.types.NoPaymentFound")
    },{
        id: 2,
        name: t("signals.types.UnexpectedAmount")
    },{
        id: 3,
        name: t("signals.types.MultiplePayments")
    },{
        id: 4,
        name: t("signals.types.NegativeBalance")
    }]
	const reactSelectStyles = useReactSelectStyles();

    const onSelectBurger = (value) => {
		const newValue = value ? value.map(v => v.value) : []
		setFilterByCitizens(newValue)
        goFirst()
	};

    const onSelectType = (value) => {
		const newValue = value ? value.map(v => v.value) : []
		setFilterByTypes(newValue)
        goFirst()
	};

    const typesSelection = types.filter(type => filterByTypes.includes(type.id!)).map(type => ({
        key: type.id,
        value: type.id,
        label: type.name,
    }));

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
                            <Checkbox data-test="checkbox.signalActive" value={"active"}>{t("signals.showActive")}</Checkbox>
                            <Checkbox data-test="checkbox.signalInactive" value={"inactive"}>{t("signals.showInActive")}</Checkbox>
                        </Stack>
                    </CheckboxGroup>
                </FormControl>

                <FormControl>
                    <FormLabel>{t("signals.filterByBurger")}</FormLabel>
                    <Select 
                        id={"citizenFilter"}
                        data-test="signal.citizenFilter"
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
                <FormControl>
                    <FormLabel>{t("signals.filterByType")}</FormLabel>
                    <Select 
                        id={"typeFilter"}
                        data-test="signal.typeFilter"
                        onChange={onSelectType} 
                        options={types.map(type => ({
                            key: type.id,
                            value: type.id,
                            label: type.name,
                        }))}
                        styles={reactSelectStyles.default} 
                        isMulti={true}
                        isClearable={true} 
                        noOptionsMessage={() => t("select.noOptions")} 
                        maxMenuHeight={350}
                        placeholder={t("select.placeholder")}
                        value={typesSelection} 
                    />
                </FormControl>
            </Stack>
			);
		}} />
	);
};

export default SignalsFilters;