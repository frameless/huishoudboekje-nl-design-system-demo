import {act, fireEvent, getByText} from "@testing-library/react";
import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import BackButton from "../components/BackButton";

// jest.mock("react-router-dom", () => require("./utils/mock-hooks").reactRouterDomMock());

let container: HTMLDivElement | null = null;

const mockedUsedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom') as any,
    useNavigate: () => mockedUsedNavigate,
}));

beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container!);
    container!.remove();
    container = null;
});

describe("Back Button", () => {

    it('should show the button without extras', function () {
        act(() => {
            render(<BackButton />, container);
        });

        expect(container!.textContent).toBe("Terug")
    });

    it('should show the button without custom label', function () {
        act(() => {
            render(<BackButton label={"Huishoudboekje"} />, container);
        });

        expect(container!.textContent).toBe("Huishoudboekje")
    });

    it('should trigger an onClick event and different navigation than default', function () {


        act(() => {
            render(<BackButton to={"/huishoudboekje"} />, container);
        });

        const clickEvent = new Event("click", {
            bubbles: true,
            cancelable: true,
        });

        const element = getByText(container!, "Terug");

        fireEvent(element, clickEvent);
        expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
        expect(mockedUsedNavigate).toHaveBeenCalledWith("/huishoudboekje");


    });

    it('should trigger an onClick event and default navigation', function () {


        act(() => {
            render(<BackButton />, container);
        });

        const clickEvent = new Event("click", {
            bubbles: true,
            cancelable: true,
        });

        const element = getByText(container!, "Terug");

        fireEvent(element, clickEvent);
        expect(mockedUsedNavigate).toHaveBeenCalledTimes(1);
        expect(mockedUsedNavigate).toHaveBeenCalledWith("/");


    });
})