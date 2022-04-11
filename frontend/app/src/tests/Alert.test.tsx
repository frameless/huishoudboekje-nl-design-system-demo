import {act} from "@testing-library/react";
import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import Alert from "../components/shared/Alert";
import {Button} from "@chakra-ui/react";

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

it("show alert with cancel button", () => {

    act(() => {
        render(
            <Alert
                title={"Burger verwijderen uit huishouden"}
                confirmButton={<Button colorScheme={"red"} ml={3}>Verwijderen</Button>}
                cancelButton={true}
                onClose={() => void (0)}
            >
                Weet je zeker dat je Chris de Burg wil verwijderen uit het huishouden de Jager-de Burg?
            </Alert>
            , container);
    });

    const html = container!.innerHTML;
    expect(html).not.toBeNull();
});

it("show alert without cancel button", () => {

    act(() => {
        render(
            <Alert
                title={"Burger verwijderen uit huishouden"}
                confirmButton={<Button colorScheme={"red"} ml={3}>Verwijderen</Button>}
                cancelButton={false}
                onClose={() => void (0)}
            >
                Weet je zeker dat je Chris de Burg wil verwijderen uit het huishouden de Jager-de Burg?
            </Alert>
            , container);
    });

    const html = container!.innerHTML;
    expect(html).not.toBeNull();
});
