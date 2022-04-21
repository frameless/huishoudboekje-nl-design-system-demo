import {EditIcon} from "@chakra-ui/icons";
import {FormControlProps, HStack, IconButton, Td, Tr, useDisclosure} from "@chakra-ui/react";
import React, {useState} from "react";
import {useTranslation} from "react-i18next";
import {Configuratie as IConfiguratie, GetConfiguratieDocument, useDeleteConfiguratieMutation} from "../../generated/graphql";
import useToaster from "../../utils/useToaster";
import UpdateParameterModal from "./UpdateParameterModal";
import DeleteConfirmButton from "../shared/DeleteConfirmButton";

const ParameterItem: React.FC<FormControlProps & { c: IConfiguratie }> = ({c, ...props}) => {
    const toast = useToaster();
    const {t} = useTranslation();
    const updateParameterModal = useDisclosure();
    const [deleteConfirm, setDeleteConfirm] = useState(false);

    const [deleteConfig] = useDeleteConfiguratieMutation({
        variables: {
            key: String(c.id),
        },
        refetchQueries: [
            {query: GetConfiguratieDocument},
        ],
    });

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

    return (<>
            {updateParameterModal.isOpen && <UpdateParameterModal onClose={updateParameterModal.onClose} configuratie={c} />}

            <Tr>
                <Td>{c.id}</Td>
                <Td>{c.waarde}</Td>
                <Td>
                    <HStack>
                        <IconButton size={"sm"} variant={"ghost"} colorScheme={"gray"} icon={<EditIcon />} aria-label={t("global.actions.edit")} onClick={() => updateParameterModal.onOpen()} />
                        <DeleteConfirmButton onConfirm={() => onDelete()} />
                    </HStack>
                </Td>
            </Tr>
        </>
    );
};

export default ParameterItem;