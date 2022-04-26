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
        showCancelButton: {
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
        showAsterisk: {
            type: {
                name: "boolean",
                required: false,
            },
            description: "This will show a asterisk or not.",
        },
        size: {
            type: {
                name: "string",
                required: false,
            },
            description: "This will show the Asterisk component in the footer of the Modal if true.",
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
                    isOpen={isOpen}
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
                    isOpen={isOpen}
                    showCancelButton={false}
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
                    showCancelButton={false}
                    isOpen={isOpen}
                    onClose={onClose}
                >
                    Hier kan een formulier neergezet worden
                </Modal>
            )}
        </>
    );
};