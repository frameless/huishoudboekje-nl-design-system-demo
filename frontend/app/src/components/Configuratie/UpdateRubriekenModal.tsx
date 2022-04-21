import React, {useRef} from 'react';
import {GetRubriekenConfiguratieDocument, Grootboekrekening, Rubriek, useGetRubriekenConfiguratieQuery, useUpdateRubriekMutation} from "../../generated/graphql";
import Modal from "../shared/Modal";
import {useTranslation} from "react-i18next";
import {Button, FormControl, FormErrorMessage, FormLabel, HStack, Input, Stack} from "@chakra-ui/react";
import Select from "react-select";
import useToaster from "../../utils/useToaster";
import useForm from "../../utils/useForm";
import {useReactSelectStyles} from "../../utils/things";
import useSelectProps from "../../utils/useSelectProps";
import Queryable from "../../utils/Queryable";
import zod from "../../utils/zod";
import Asterisk from "../shared/Asterisk";

const validator = zod.object({
    naam: zod.string().nonempty(),
    grootboekrekening: zod.string().nonempty(),
});

type UpdateRubriekenModalProps = {
    onClose: VoidFunction,
    rubriek: Rubriek,
};

const UpdateRubriekenModal: React.FC<UpdateRubriekenModalProps> = ({onClose, rubriek}) => {
    const toast = useToaster();
    const {t} = useTranslation();
    const cancelDeleteRef = useRef(null);
    const {naam} = rubriek || {};
    const $rubriekenConfiguratie = useGetRubriekenConfiguratieQuery();
    const reactSelectStyles = useReactSelectStyles();
    const selectProps = useSelectProps();
    const [updateRubriek, {loading}] = useUpdateRubriekMutation({
        refetchQueries: [
            {query: GetRubriekenConfiguratieDocument, variables: {id: rubriek.id}},
        ],
    });

    const [form, {updateForm, isValid, isFieldValid, reset, toggleSubmitted}] = useForm<zod.infer<typeof validator>>({
        validator,
        initialValue: {
            naam,
        }
    });

    const onSubmit = (e) => {
        e.preventDefault();
        toggleSubmitted(true);

        if (!isValid()) {
            toast({
                error: t("messages.genericError.description"),
            });
            return;
        }

        updateRubriek({
            variables: {
                id: rubriek.id!,
                naam: form.naam!,
                grootboekrekeningId: form.grootboekrekening!,
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
    };

    return (

        <Queryable query={$rubriekenConfiguratie} children={data => {
            const grootboekrekeningen: Grootboekrekening[] = data.grootboekrekeningen || [];

            const grootboekrekeningenOptions = selectProps.createSelectOptionsFromGrootboekrekeningen(grootboekrekeningen);
            return (
                <Modal
                    title={t("modal.updateRubrieken.title")}
                    onClose={onClose}
                    isOpen={true}
                >
                    <form onSubmit={onSubmit} noValidate={true}>
                        <Stack direction={["column"]} alignItems={"flex-end"}>
                            <FormControl isInvalid={!isFieldValid("naam")} isRequired={true}>
                                <FormLabel>{t("forms.rubrieken.fields.naam")}</FormLabel>
                                <Input onChange={v => updateForm("naam", v.target.value)} value={form.naam || ""} />
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
            )
        }} />

    );
};

export default UpdateRubriekenModal;