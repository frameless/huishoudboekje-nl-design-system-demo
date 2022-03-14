import arrayToSentence from "array-to-sentence";

export const humanJoin = (x) => arrayToSentence(x, {
	lastSeparator: " en ",
});

export const Months = ["jan", "feb", "mrt", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];