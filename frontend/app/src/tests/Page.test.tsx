import {act, fireEvent, getByText, screen} from "@testing-library/react";
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

    it("Page with only title", () => {
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
        expect(title).toBeInTheDocument();
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

        // expect(pretty(container?.innerHTML)).toMatchSnapshot();

    });


    it("Page with title & backButton", () => {
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

    it("Page with title & menu", () => {
        act(() => {
            render(
                <Page
                    title={"Bankafschriften"}
                    menu={(
                        <Menu>
                            <IconButton as={MenuButton} icon={<MenuIcon />} variant={"solid"} aria-label={"Open menu"} />
                            <MenuList>
                                <MenuItem>Alle transacties afletteren</MenuItem>
                            </MenuList>
                        </Menu>
                    )}
                />
                , container);
        });

        // expect(pretty(container?.innerHTML)).toMatchSnapshot();

        const pageMenu = screen.queryAllByRole("menu");

        expect(pageMenu).toMatchSnapshot();

    });
});


//
// it("Page with title & right", () => {
//     act(() => {
//         render(
//             <Page
//                 title={"Bankafschriften"}
//                 right={(
//                     <ButtonGroup size={"sm"} isAttached variant={"outline"}>
//                         <Button mr={"-px"} colorScheme={"primary"} variant={"outline"} size={"sm"}>Actie</Button>
//                         <Button colorScheme={"primary"} variant={"outline"} size={"sm"}>Actie</Button>
//                     </ButtonGroup>
//                 )}
//             />
//             , container);
//     });
//
//     const html = container!.innerHTML;
//     expect(html).not.toBeNull();
// });
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