import {Box, Button, FormControl, FormErrorMessage, FormLabel, Input, Stack} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {CreateAfdelingInput, Organisatie} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import AfdelingValidator from "../../validators/AfdelingValidator";

type AfdelingFormProps = {
	organisatie: Organisatie,
	onChange: (values) => void,
	values?: CreateAfdelingInput,
};

const AfdelingForm: React.FC<AfdelingFormProps> = ({values, organisatie, onChange}) => {
	const toast = useToaster();
	const {t} = useTranslation();
	const [data, setData] = useState(values || {} as CreateAfdelingInput);

	const isValid = (fieldName: string) => AfdelingValidator.shape[fieldName]?.safeParse(data[fieldName]).success;
	const updateForm = (field: string, value: any) => {
		setData(prevData => ({
			...prevData,
			[field]: value,
		}));
	};

	const onSubmit = (e) => {
		e.preventDefault();

		try {
			const validatedData = AfdelingValidator.parse(data);
			onChange({
				...validatedData,
				organisatieId: organisatie.id,
			});
		}
		catch (err) {
			toast({error: t("global.formError"), title: t("messages.genericError.title")});
		}
	};

	return (
		<form onSubmit={onSubmit}>
			<Stack spacing={5}>

				<Stack>
					<FormControl flex={1} isInvalid={!isValid("naam")} isRequired={true}>
						<FormLabel>{t("forms.createAfdeling.naam")}</FormLabel>
						<Input value={data.naam || ""} onChange={e => updateForm("naam", e.target.value)} />
						<FormErrorMessage>{t("afspraakDetailView.invalidNaamError")}</FormErrorMessage>
					</FormControl>
				</Stack>

				<Box>
					<Button type={"submit"} colorScheme={"primary"}>{t("global.actions.save")}</Button>
				</Box>

			</Stack>
		</form>
	);
};

export default AfdelingForm;