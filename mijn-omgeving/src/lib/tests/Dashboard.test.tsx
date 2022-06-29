import {act, getAllByLabelText, getByText} from "@testing-library/react";
import React from "react";
import {render, unmountComponentAtNode} from "react-dom";
import '@testing-library/jest-dom';
import Dashboard from "../components/Dashboard";

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

describe("Dashboard", () => {

    it('should check the visibility of the text', function () {
        act(() => {
            render(<Dashboard />, container);
        });

        expect(container?.innerHTML).toMatchSnapshot();

        const heading = getByText(container!, "Huishoudboekje");
        expect(heading).toBeVisible();

        const title = getByText(container!, "Toekomst");
        expect(title).toBeVisible();

        const subTitle = getByText(container!, "Verwachte transacties");
        expect(subTitle).toBeVisible();
    });

    it('should render the card component', function () {
        act(() => {
            render(<Dashboard />, container);
        });

        const cards = getAllByLabelText(container!, "ArrowRightIcon");

        cards.forEach(card => {
            expect(card).toBeVisible();

            const spy = jest.spyOn(card, "click");
            card.click();

            expect(spy).toHaveBeenCalledTimes(1);
        })
        
    });

});
