import React from 'react';
import Modal from "../shared/Modal";
import {useTranslation} from "react-i18next";
import {Button, FormControl, FormErrorMessage, FormLabel, Input, Stack} from "@chakra-ui/react";
import zod from "../../utils/zod";
import {Configuratie, GetConfiguratieDocument, useUpdateConfiguratieMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import useForm from "../../utils/useForm";
import Asterisk from "../shared/Asterisk";

const validator = zod.object({
    id: zod.string().nonempty(),
    waarde: zod.string().nonempty(),
});

type UpdateParameterModalProps = {
    onClose: VoidFunction,
    configuratie: Configuratie,
}

const UpdateParameterModal: React.FC<UpdateParameterModalProps> = ({onClose, configuratie}) => {
    const {t} = useTranslation();
    const toast = useToaster();
    const {id, waarde} = configuratie || {};
    const [updateConfiguratie, {loading}] = useUpdateConfiguratieMutation({
        refetchQueries: [
            {query: GetConfiguratieDocument, variables: {id: configuratie.id}},
        ],
    });
    const [form, {updateForm, isValid, isFieldValid, reset, toggleSubmitted}] = useForm<zod.infer<typeof validator>>({
        validator,
        initialValue: {
            id, waarde,
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

        updateConfiguratie({
            variables: {
                key: configuratie.id!,
                value: form.waarde!,
            },
        })
            .then(() => {
                reset();
                toast({
                    success: t("messages.configuratie.updateSuccess"),
                });
                onClose();
            })
            .catch(err => {
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
        <Modal
            title={t("modal.updateParameter.title")}
            onClose={onClose}
            isOpen={true}
        >
            <form onSubmit={onSubmit} noValidate={true}>
                <Stack direction={"column"} alignItems={"flex-end"}>
                    <FormControl isDisabled={true}>
                        <FormLabel>{t("forms.configuratie.fields.id")}</FormLabel>
                        <Input value={form.id || ""} />
                    </FormControl>
                    <FormControl isInvalid={!isFieldValid("value")} isRequired={true}>
                        <FormLabel>{t("forms.configuratie.fields.waarde")}</FormLabel>
                        <Input onChange={e => updateForm("waarde", e.target.value)} value={form.waarde || ""} />
                        <FormErrorMessage>{t("configuratieForm.emptyValueError")}</FormErrorMessage>
                    </FormControl>
                    <Button type={"submit"} colorScheme={"primary"} isLoading={loading}>{t("global.actions.save")}</Button>
                    <Asterisk />
                </Stack>
            </form>
        </Modal>
    );
};

export default UpdateParameterModal;