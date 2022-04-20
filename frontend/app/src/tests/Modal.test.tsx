import {act} from "@testing-library/react";
import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import {Button} from "@chakra-ui/react";
import Modal from "../components/shared/Modal";

jest.mock("react-i18next", () => require("./utils/mock-hooks").reactI18NextMock());

let container: HTMLDivElement | null = null;

beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container!);
    container!.remove();
    container = null;
});

it("show modal", () => {
    act(() => {
        render(
            <Modal
                title={"Burger toevoegen"}
                confirmButton={<Button colorScheme={"red"} ml={3}>Verwijderen</Button>}
                onClose={() => void (0)}
            >
                Hier kan een formulier neergezet worden
            </Modal>
            , container);
    });

    const html = container!.innerHTML;
    expect(html).not.toBeNull();
});

it("show modal without cancel button", () => {
    act(() => {
        render(
            <Modal
                title={"Burger toevoegen"}
                confirmButton={<Button colorScheme={"red"} ml={3}>Verwijderen</Button>}
                onClose={() => void (0)}
                cancelButton={false}
            >
                Hier kan een formulier neergezet worden
            </Modal>
            , container);
    });

    const html = container!.innerHTML;
    expect(html).not.toBeNull();
});