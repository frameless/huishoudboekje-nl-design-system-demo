import {act} from "@testing-library/react";
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
    });

    it("Page with all options", () => {
        act(() => {
            render(
                <Page
                    title={"Bankafschriften"}
                    backButton={<Button />}
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


});

// it("Page with title & backButton", () => {
//     const onClick = jest.fn();
//     const label = "Terug"
//
//     act(() => {
//         render(
//             <Router>
//                 <Page
//                     title={"Bankafschriften"}
//                     backButton={<BackButton to={"navigatie Link"} label={label} />}
//                 />
//             </Router>
//             , container);
//     });
//
//     expect(pretty(container?.innerHTML)).toMatchSnapshot();
//
// });

// it("Page with title & menu", () => {
//     act(() => {
//         render(
//             <Page
//                 title={"Bankafschriften"}
//                 menu={(
//                     <Menu>
//                         <IconButton as={MenuButton} icon={<MenuIcon />} variant={"solid"} aria-label={"Open menu"} />
//                         <MenuList>
//                             <MenuItem>Alle transacties afletteren</MenuItem>
//                         </MenuList>
//                     </Menu>
//                 )}
//             />
//             , container);
//     });
//
//     expect(pretty(container?.innerHTML)).toMatchSnapshot();
//
// });

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
//
