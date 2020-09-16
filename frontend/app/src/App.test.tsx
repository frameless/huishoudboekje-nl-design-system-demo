import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("Shows api status", () => {
	const { getByText } = render(<App />);
	const linkElement = getByText(/API status/i);
	expect(linkElement).toBeInTheDocument();
});
