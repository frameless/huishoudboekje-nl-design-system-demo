import {SearchIcon} from "@chakra-ui/icons";
import {Divider, Input, InputGroup, InputLeftElement, Stack, StackProps, Text} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import {useInput} from "react-grapple";
import {useTranslation} from "react-i18next";
import {Afspraak} from "../../../generated/graphql";
import SelectAfspraakOption from "./SelectAfspraakOption";

type SelectAfspraakProps = Omit<StackProps, "onChange"> & {
	options: Afspraak[],
	onChange: (afspraak: Afspraak) => void,
	value?: Afspraak
}

const SelectAfspraak: React.FC<SelectAfspraakProps> = ({options, value, onChange, ...props}) => {
	const {t} = useTranslation();
	const [results, setResults] = useState<Afspraak[]>(options);
	const search = useInput<string>({
		placeholder: t("forms.search.fields.search")
	});

	const filterFn = (input: string) => (afspraak: Afspraak) => {
		const searchData = [
			afspraak.beschrijving,
			afspraak.gebruiker?.voornamen,
			afspraak.gebruiker?.voorletters,
			afspraak.gebruiker?.achternaam,
			afspraak.tegenRekening?.iban,
			afspraak.organisatie?.weergaveNaam,
			afspraak.organisatie?.kvkNummer,
			afspraak.bedrag,
			afspraak.kenmerk
		];

		return searchData.some(x => x && x.toLowerCase().indexOf(input.toLowerCase()) > -1);
	}

	useEffect(() => {
		if (search.value.trim().length === 0) {
			setResults(options);
			return;
		}

		setResults(options.filter(filterFn(search.value.trim())));
	}, [search.value, options]);

	return (
		<Stack spacing={2} {...props}>
			<InputGroup>
				<InputLeftElement>
					<SearchIcon color={"gray.200"} />
				</InputLeftElement>
				<Input {...search.bind} />
			</InputGroup>

			<Divider />

			{results.length === 0 ? (
				<Text>{t("select.noOptions")}</Text>
			) : (
				<Stack spacing={0} maxHeight={200} overflowY={"auto"}>
					{results.map(a => <SelectAfspraakOption key={a.id} afspraak={a} isSelected={value && value.id === a.id} onClick={() => onChange(a)} px={5} />)}
				</Stack>
			)}
		</Stack>
	);
};

export default SelectAfspraak;