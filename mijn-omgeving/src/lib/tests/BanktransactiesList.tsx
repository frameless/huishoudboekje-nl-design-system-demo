import React from 'react';
import {render, unmountComponentAtNode} from "react-dom";
import {act} from "@testing-library/react";
import BanktransactiesList from "../components/Banktransacties/BanktransactiesList";

let container: HTMLDivElement | null = null;

beforeAll(() => {
    window.matchMedia = (query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    });
});

beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container!);
    container!.remove();
    container = null;
});

describe("Banktransacties List", () => {

    it('should show null transactions', function () {
        act(() => {
            render(<BanktransactiesList transacties={[]} />, container);
        });

        const element = container!.querySelector("div");
        expect(element).not.toBe(null);
        expect(element!.children.length).toEqual(0);
    });
})