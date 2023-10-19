import {Button, FormControl, FormErrorMessage, FormLabel, HStack, Input, Stack} from "@chakra-ui/react";
import React, {useRef} from "react";
import {useTranslation} from "react-i18next";
import Select from "react-select";
import {GetRubriekenConfiguratieDocument, Grootboekrekening, Rubriek, useGetRubriekenConfiguratieQuery, useUpdateRubriekMutation} from "../../generated/graphql";
import Queryable from "../../utils/Queryable";
import {useReactSelectStyles} from "../../utils/things";
import useForm from "../../utils/useForm";
import useSelectProps from "../../utils/useSelectProps";
import useToaster from "../../utils/useToaster";
import zod from "../../utils/zod";
import useRubriekValidator from "../../validators/useRubriekValidator";
import Asterisk from "../shared/Asterisk";
import Modal from "../shared/Modal";

type UpdateRubriekModalProps = {
	onClose: VoidFunction,
	rubriek: Rubriek,
};

const UpdateRubriekModal: React.FC<UpdateRubriekModalProps> = ({onClose, rubriek}) => {
	const validator = useRubriekValidator();
	const toast = useToaster();
	const {t} = useTranslation();
	const cancelDeleteRef = useRef(null);
	const {naam, grootboekrekening} = rubriek || {};
	const $rubriekenConfiguratie = useGetRubriekenConfiguratieQuery();
	const reactSelectStyles = useReactSelectStyles();
	const selectProps = useSelectProps();
	const [updateRubriek, {loading}] = useUpdateRubriekMutation({
		refetchQueries: [
			{query: GetRubriekenConfiguratieDocument, variables: {id: rubriek.id}},
		],
	});
	const [form, {updateForm, isFieldValid, reset, toggleSubmitted}] = useForm<zod.infer<typeof validator>>({
		validator,
		initialValue: {
			naam,
			grootboekrekening: grootboekrekening?.id,
		},
	});

	const onSubmit = (e) => {
		e.preventDefault();
		toggleSubmitted(true);

		try {
			const data = validator.parse(form);

			updateRubriek({
				variables: {
					id: rubriek.id!,
					naam: data.naam!,
					grootboekrekeningId: data.grootboekrekening!,
				},
			}).then(() => {
				reset();
				toast({
					success: t("messages.rubrieken.updateSuccess"),
				});
				onClose();
			}).catch(err => {
				let message = err.message;
				if (err.message.includes("already exists")) {
					message = t("messages.configuratie.alreadyExists");
				}

				toast({
					error: message,
				});
			});
		}
		catch (err) {
			toast({
				error: t("messages.genericError.description"),
			});
		}
	};

	return (
		<Queryable query={$rubriekenConfiguratie} children={data => {
			const grootboekrekeningen: Grootboekrekening[] = data.grootboekrekeningen || [];

			const grootboekrekeningenOptions = selectProps.createSelectOptionsFromGrootboekrekeningen(grootboekrekeningen);
			return (
				<Modal title={t("modal.updateRubrieken.title")} onClose={onClose}>
					<form onSubmit={onSubmit} noValidate={true}>
						<Stack direction={["column"]} alignItems={"flex-end"}>
							<FormControl isInvalid={!isFieldValid("naam")} isRequired={true}>
								<FormLabel>{t("forms.rubrieken.fields.naam")}</FormLabel>
								<Input
								 	autoComplete="no"
									aria-autocomplete="none"
									onChange={v => updateForm("naam", v.target.value)}
									value={form.naam || ""}
								/>
								<FormErrorMessage>{t("configuratieForm.emptyNameErroror")}</FormErrorMessage>
							</FormControl>
							<FormControl isInvalid={!isFieldValid("grootboekrekening")} isRequired={true}>
								<FormLabel>{t("forms.rubrieken.fields.grootboekrekening")}</FormLabel>
								<Select
									{...selectProps.defaultProps}
									components={selectProps.components.MultiLine}
									options={grootboekrekeningenOptions}
									styles={reactSelectStyles.default}
									onChange={(result) => updateForm("grootboekrekening", result?.value)}
									value={form.grootboekrekening ? grootboekrekeningenOptions.find(g => g.value === form.grootboekrekening) : null}
								/>
								<FormErrorMessage>{t("configuratieForm.emptyGrootboekrekeningError")}</FormErrorMessage>
							</FormControl>
							<HStack>
								<Button ref={cancelDeleteRef} onClick={onClose}>{t("global.actions.cancel")}</Button>
								<Button type={"submit"} colorScheme={"primary"} isLoading={loading}>{t("global.actions.save")}</Button>
							</HStack>
							<Asterisk />
						</Stack>
					</form>
				</Modal>
			);
		}} />

	);
};

export default UpdateRubriekModal;
