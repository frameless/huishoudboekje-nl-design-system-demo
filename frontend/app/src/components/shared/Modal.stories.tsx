import Modal from "./Modal";

import {Button, useDisclosure} from "@chakra-ui/react";
import {ComponentMeta} from "@storybook/react";
import React from "react";

export default {
    title: "Huishoudboekje/Modal",
    component: Modal,
    argTypes: {
        title: {
            type: {
                name: "string",
                required: true,
            },
            description: "This is the title of the modal.",
        },
        isOpen: {
            type: {
                name: "boolean",
                required: false,
            },
            description: "isOpen is by default on true. If you want isOpen to be false you can change it.",
        },
        children: {
            type: {
                name: "other",
                required: true,
            },
            description: "This wil contain te information you want to show. This can be text or a form for example.",
        },
        confirmButton: {
            type: {
                name: "function",
                required: false,
            },
            description: "When this button is clicked, the action will be executed.",
        },
        cancelButton: {
            type: {
                name: "function",
                required: false,
            },
            description: "When this button is clicked, the action will not be executed and the modal will be closed.",
        },
        onClose: {
            type: {
                name: "function",
                required: true,
            },
            description: "A function that will close the modal.",
        },
    },
} as ComponentMeta<typeof Modal>;

export const Default = () => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    return (
        <>
            <Button onClick={onOpen}>Open</Button>
            {isOpen && (
                <Modal
                    title={"Burger toevoegen"}
                    confirmButton={<Button colorScheme={"red"} ml={3}>Verwijderen</Button>}
                    onClose={onClose}
                >
                    Hier kan een formulier neergezet worden
                </Modal>
            )}
        </>
    );
};

export const WithoutCancelButton = () => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    return (
        <>
            <Button onClick={onOpen}>Open</Button>
            {isOpen && (
                <Modal
                    title={"Burger toevoegen"}
                    confirmButton={<Button colorScheme={"red"} ml={3}>Verwijderen</Button>}
                    onClose={onClose}
                    cancelButton={false}
                >
                    Hier kan een formulier neergezet worden
                </Modal>
            )}
        </>
    );
};

export const WithoutButtons = () => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    return (
        <>
            <Button onClick={onOpen}>Open</Button>
            {isOpen && (
                <Modal
                    title={"Burger toevoegen"}
                    cancelButton={false}
                    onClose={onClose}
                >
                    Hier kan een formulier neergezet worden
                </Modal>
            )}
        </>
    );
};