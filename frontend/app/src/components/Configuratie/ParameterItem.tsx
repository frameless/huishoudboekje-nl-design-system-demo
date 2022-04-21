import {EditIcon} from "@chakra-ui/icons";
import {FormControlProps, HStack, IconButton, Td, Tr, useDisclosure} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Configuratie as IConfiguratie, GetConfiguratieDocument, useDeleteConfiguratieMutation, useUpdateConfiguratieMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import UpdateParameterModal from "./UpdateParameterModal";
import DeleteConfirmButton from "../shared/DeleteConfirmButton";

const ParameterItem: React.FC<FormControlProps & { c: IConfiguratie }> = ({c, ...props}) => {
    const toast = useToaster();
    const {t} = useTranslation();
    const updateParameterModal = useDisclosure();
    const [value, setValue] = useState(c.waarde);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [isSubmitted, setSubmitted] = useState(false);
    const onChange = (e) => {
        setValue(e.target.value);
    };

    const [updateConfig] = useUpdateConfiguratieMutation({
        refetchQueries: [
            {query: GetConfiguratieDocument},
        ],
    });
    const [deleteConfig] = useDeleteConfiguratieMutation({
        variables: {
            key: String(c.id),
        },
        refetchQueries: [
            {query: GetConfiguratieDocument},
        ],
    });

    const onSubmit = () => {
        if (isSubmitted) {
            return false;
        }

        updateConfig({
            variables: {
                key: String(c.id),
                value: String(value),
            },
        }).then(() => {
            setSubmitted(true);
            toast({
                success: t("messages.configuratie.updateSuccess"),
            });
        });
    };

    const onClickDelete = () => {
        onDelete();
    };

    const onDelete = () => {
        deleteConfig().then(result => {
            if (result.data?.deleteConfiguratie?.ok) {
                setDeleteConfirm(false);
                toast.closeAll();
                toast({
                    success: t("messages.configuratie.deleteSuccess"),
                });
            }
        });
    };

    // const onFocus = () => {
    //     setSubmitted(false);
    //     setDeleteConfirm(false);
    // };

    return (<>
            {updateParameterModal.isOpen && <UpdateParameterModal onClose={updateParameterModal.onClose} configuratie={c} />}

            <Tr>
                <Td>{c.id}</Td>
                <Td>
                    {/*<Editable defaultValue={c.waarde} flex={1} submitOnBlur={true} onSubmit={onSubmit} onFocus={onFocus}>*/}
                    {/*    <EditablePreview />*/}
                    {/*    <EditableInput onChange={onChange} name={c.id} id={c.id} />*/}
                    {/*</Editable>*/}
                    {c.waarde}
                </Td>
                <Td>
                    <HStack>
                        <IconButton size={"sm"} variant={"ghost"} colorScheme={"gray"} icon={<EditIcon />} aria-label={t("global.actions.edit")} onClick={() => updateParameterModal.onOpen()} />
                        <DeleteConfirmButton onConfirm={() => onClickDelete()} />
                    </HStack>
                </Td>
            </Tr>
        </>
    );
};

export default ParameterItem;