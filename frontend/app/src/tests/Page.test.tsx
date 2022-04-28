import {act, fireEvent, getByLabelText, getByText, screen, waitFor} from "@testing-library/react";
import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import Page from "../components/shared/Page";
import pretty from "pretty";
import {Button, ButtonGroup, IconButton, Menu, MenuButton, MenuItem, MenuList} from "@chakra-ui/react";
import MenuIcon from "../components/shared/MenuIcon";
import SectionContainer from "../components/shared/SectionContainer";

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

describe("Page", () => {

    it("Renders a title", () => {
        act(() => {
            render(
                <Page
                    title={"Bankafschriften"} />
                , container);
        });

        expect(pretty(container?.innerHTML)).toMatchSnapshot();

        // Checks the title
        const [pageTitle] = screen.queryAllByRole("heading");

        const title = getByText(pageTitle, "Bankafschriften");
        expect(title).toBeVisible();
    });

    it("Page with all options", () => {
        const onClick = jest.fn();

        act(() => {
            render(
                <Page
                    title={"Bankafschriften"}
                    backButton={<Button onClick={onClick}>Click</Button>}
                    menu={(
                        <Menu>
                            <IconButton as={MenuButton} icon={<MenuIcon />} variant={"solid"} aria-label={"Open menu"} />
                            <MenuList>
                                <MenuItem>Alle transacties afletteren</MenuItem>
                            </MenuList>
                        </Menu>
                    )}
                    right={(
                        <ButtonGroup size={"sm"} isAttached variant={"outline"}>
                            <Button mr={"-px"} colorScheme={"primary"} variant={"outline"} size={"sm"}>Actie</Button>
                            <Button colorScheme={"primary"} variant={"outline"} size={"sm"}>Actie</Button>
                        </ButtonGroup>
                    )}
                >
                    <SectionContainer />
                </Page>
                , container);
        });

        expect(pretty(container?.innerHTML)).toMatchSnapshot();

    });


    it("Renders with a backbutton", () => {
        const onClick = jest.fn();

        act(() => {
            render(
                <Page
                    title={"Bankafschriften"}
                    backButton={<Button onClick={onClick}>Click</Button>}
                />
                , container);
        });

        expect(pretty(container?.innerHTML)).toMatchSnapshot();

        // Checks the backbutton
        const [pageButton] = screen.queryAllByRole("button");

        const clickEvent = new Event("click", {
            bubbles: true,
            cancelable: true,
        });

        const backButton = getByText(pageButton, "Click");
        expect(backButton).toBeInTheDocument();

        fireEvent(backButton, clickEvent);
        expect(onClick).toHaveBeenCalledTimes(1);

    });

    it("Renders a menu", async () => {
        const onClick = jest.fn();

        act(() => {
            render(
                <Page
                    title={"Bankafschriften"}
                    menu={(
                        <Menu>
                            <IconButton as={MenuButton} icon={<MenuIcon />} variant={"solid"} aria-label={"Open menu"} onClick={onClick} />
                            <MenuList>
                                <MenuItem onClick={onClick}>Alle transacties afletteren</MenuItem>
                            </MenuList>
                        </Menu>
                    )}
                />
                , container);
        });


        expect(pretty(container?.innerHTML)).toMatchSnapshot();
        expect(onClick).toHaveBeenCalledTimes(0);

        const iconButton = getByLabelText(container!, "Open menu")
        expect(iconButton).toBeVisible();

        const clickEvent = new Event("click", {
            bubbles: true,
            cancelable: true,
        });

        fireEvent(iconButton, clickEvent);

        expect(pretty(container?.innerHTML)).toMatchSnapshot();
        expect(onClick).toHaveBeenCalledTimes(1);

        const menuItem = getByText(container!, "Alle transacties afletteren");
        await waitFor(() => expect(menuItem).toBeVisible());

        fireEvent(menuItem, clickEvent);
        expect(onClick).toHaveBeenCalledTimes(2);
    });

    it("Renders components on the right", () => {
        act(() => {
            render(
                <Page
                    title={"Bankafschriften"}
                    right={(
                        <Button colorScheme={"primary"} variant={"outline"} size={"sm"}>Actie</Button>
                    )}
                />
                , container);
        });

        
    });
});


//
// it("Page with title & children", () => {
//     act(() => {
//         render(
//             <Page title={"Bankafschriften"}>
//                 <SectionContainer />
//             </Page>
//             , container);
//     });
//
//     const html = container!.innerHTML;
//     expect(html).not.toBeNull();
// });